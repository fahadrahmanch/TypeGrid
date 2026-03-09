import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/competition-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
import { IStartQuickPlayUseCase } from "../../interfaces/user/quick-play/start-quick-play.interface";
import { CompetitionEntity } from "../../../../domain/entities/competition.entity";
import { ICompetitionDocument } from "../../../../infrastructure/db/types/documents";
import { mapCompetitionToDTOQuickPlay } from "../../../mappers/user/competition-quick-play.mapper";
import { CompetitionDTOQuickPlay } from "../../../DTOs/user/competition-quick-play.dto";
export class StartQuickPlayUseCase implements IStartQuickPlayUseCase {
  constructor(
    private competitionRepository: ICompetitionRepository,
    private userRepository: IUserRepository,
    private lessonRepository: ILessonRepository,
  ) {}
  async execute(userId: string): Promise<CompetitionDTOQuickPlay> {
    if (!userId) {
      throw new CustomError(
        HttpStatusCodes.BAD_REQUEST,
        MESSAGES.USER_ID_REQUIRED_QUICK_PLAY,
      );
    }
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.AUTH_USER_NOT_FOUND,
      );
    }

    const competition = await this.competitionRepository.findOne({
      status: "pending",
      $expr: { $lt: [{ $size: "$participants" }, 5] },
      participants: { $ne: userId },
    });

    if (competition) {
      const competitionEntity = new CompetitionEntity({
        ...(competition as unknown as import("../../../../domain/entities/competition.entity").CompetitionProps),
        id: (competition as ICompetitionDocument)._id!.toString(),
        participants: (competition as ICompetitionDocument).participants.map((p: any) =>
          p.toString(),
        ),
      });

      competitionEntity.addParticipant(userId.toString());

      await this.competitionRepository.updateById((competition as ICompetitionDocument)._id!.toString(), {
        participants: competitionEntity.getParticipants(),
      });

      const populatedParticipants = await Promise.all(
        competitionEntity
          .getParticipants()
          .map((id: string) => this.userRepository.findById(id)),
      );

      const lesson = await this.lessonRepository.findById(
        (competition as ICompetitionDocument).textId!.toString(),
      );

      return mapCompetitionToDTOQuickPlay({
        ...competition,
        participants: populatedParticipants,
        lesson,
      });
    }
    const levels = ["beginner", "intermediate", "advanced"];
    const selectedLevel = levels[Math.floor(Math.random() * levels.length)];

    const lessons = await this.lessonRepository.find({
      level: selectedLevel,
      createdBy: "admin",
    });

    const selectedLesson = lessons[Math.floor(Math.random() * lessons.length)];

    const competitionEntity = new CompetitionEntity({
      type: "quick",
      mode: "global",
      duration: 50,
      countDown: 10,
      status: "pending",
      participants: [userId.toString()],
      textId: (selectedLesson as any)._id?.toString() || (selectedLesson as any).id?.toString(),
    });

    const createdCompetition =
      await this.competitionRepository.create(competitionEntity);

    const populatedParticipants = [await this.userRepository.findById(userId)];

    return mapCompetitionToDTOQuickPlay({
      ...(createdCompetition as ICompetitionDocument),
      participants: populatedParticipants,
      lesson: selectedLesson,
    });
  }
}
