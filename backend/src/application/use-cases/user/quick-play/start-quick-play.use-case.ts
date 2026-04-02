import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/competition-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
import { IStartQuickPlayUseCase } from "../../interfaces/user/quick-play/start-quick-play.interface";
import { CompetitionEntity } from "../../../../domain/entities/competition.entity";
import { mapCompetitionToDTOQuickPlay } from "../../../mappers/user/competition-quick-play.mapper";
import { CompetitionDTOQuickPlay } from "../../../DTOs/user/competition-quick-play.dto";

export class StartQuickPlayUseCase implements IStartQuickPlayUseCase {
  constructor(
    private readonly _competitionRepository: ICompetitionRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _lessonRepository: ILessonRepository,
  ) {}

  async execute(userId: string): Promise<CompetitionDTOQuickPlay> {
    if (!userId) {
      throw new CustomError(
        HttpStatusCodes.BAD_REQUEST,
        MESSAGES.USER_ID_REQUIRED_QUICK_PLAY,
      );
    }

    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.AUTH_USER_NOT_FOUND,
      );
    }

    const competition = await this._competitionRepository.findOne({
      status: "pending",
      $expr: { $lt: [{ $size: "$participants" }, 5] },
      participants: { $ne: userId },
    });

    if (competition) {
      competition.addParticipant(userId);

      await this._competitionRepository.updateById(
        competition.getId()!.toString(),
        {
          participants: competition.getParticipants(),
        },
      );

      const lesson = await this._lessonRepository.findById(
        competition.getTextId()!.toString(),
      );

      const populatedParticipants = await Promise.all(
        competition.getParticipants().map(async (id: string) => {
          const member = await this._userRepository.findById(id);
          return {
            _id: member!._id,
            name: member!.name,
            imageUrl: member!.imageUrl,
          };
        }),
      );

      return mapCompetitionToDTOQuickPlay({
        ...competition.toObject(),
        participants: populatedParticipants,
        lesson: {
          _id: lesson?._id ?? "",
          text: lesson?.text ?? "",
          category: lesson?.category ?? "",
          level: lesson?.level ?? "",
        },
      });
    }

    const levels = ["beginner", "intermediate", "advanced"];
    const selectedLevel = levels[Math.floor(Math.random() * levels.length)];

    const lessons = await this._lessonRepository.find({
      level: selectedLevel,
      createdBy: "admin",
    });

    if (!lessons.length) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.LESSON_NOT_FOUND,
      );
    }

    const selectedLesson = lessons[Math.floor(Math.random() * lessons.length)];

    const competitionEntity = new CompetitionEntity({
      type: "quick",
      mode: "global",
      duration: 300,
      countDown: 10,
      status: "pending",
      participants: [userId],
      textId: selectedLesson._id?.toString(),
    });

    const createdCompetition = await this._competitionRepository.create(
      competitionEntity.toObject(),
    );

    const populatedParticipants = await Promise.all(
      createdCompetition.getParticipants().map(async (id: string) => {
        const member = await this._userRepository.findById(id);
        return {
          _id: member!._id,
          name: member!.name,
          imageUrl: member!.imageUrl,
        };
      }),
    );

    return mapCompetitionToDTOQuickPlay({
      ...createdCompetition.toObject(),
      participants: populatedParticipants,
      lesson: {
        _id: selectedLesson._id ?? "",
        text: selectedLesson.text,
        category: selectedLesson.category,
        level: selectedLesson.level,
      },
    });
  }
}
