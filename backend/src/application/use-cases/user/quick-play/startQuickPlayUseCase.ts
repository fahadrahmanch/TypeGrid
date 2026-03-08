import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/ICompetitionRepository";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/customError";
import { HttpStatusCodes } from "../../../../domain/enums/httpStatusCodes";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/IUserRepository";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/ILessonRepository";
import { IStartQuickPlayUseCase } from "../../interfaces/user/quickPlayUseCases/IStartQuickPlayUseCase";
import { CompetitionEntity } from "../../../../domain/entities/CompetitionEntity";
import { mapCompetitionToDTOQuickPlay } from "../../../DTOs/user/CompetitionDTOQuickPlay";
import { CompetitionDTOQuickPlay } from "../../../DTOs/user/CompetitionDTOQuickPlay";
export class startQuickPlayUseCase implements IStartQuickPlayUseCase {
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
        ...(competition as any),
        id: (competition as any)._id,
        participants: (competition as any).participants.map((p: any) =>
          p.toString(),
        ),
      });

      competitionEntity.addParticipant(userId.toString());

      await this.competitionRepository.updateById((competition as any)._id, {
        participants: competitionEntity.getParticipants(),
      });

      const populatedParticipants = await Promise.all(
        competitionEntity
          .getParticipants()
          .map((id: string) => this.userRepository.findById(id)),
      );

      const lesson = await this.lessonRepository.findById(
        (competition as any).textId,
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
      textId:
        (selectedLesson as any)._id?.toString() || (selectedLesson as any).id,
    });

    const createdCompetition =
      await this.competitionRepository.create(competitionEntity);

    const populatedParticipants = [await this.userRepository.findById(userId)];

    return mapCompetitionToDTOQuickPlay({
      ...(createdCompetition as any),
      participants: populatedParticipants,
      lesson: selectedLesson,
    });
  }
}
