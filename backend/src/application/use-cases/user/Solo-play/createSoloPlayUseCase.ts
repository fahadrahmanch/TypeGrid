import { ICreateSoloPlayUseCase } from "../../interfaces/user/soloPlayUserCases/ICreateSoloPlayUseCase";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/ILessonRepository";
import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/ICompetitionRepository";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/IUserRepository";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/customError";
import { HttpStatusCodes } from "../../../../domain/enums/httpStatusCodes";
import { CompetitionEntity } from "../../../../domain/entities/CompetitionEntity";
import { CompetitionDTOSoloPlay } from "../../../../application/DTOs/user/CompetitionDTOSoloPlay";
import { mapCompetitionToDTOSoloPlay } from "../../../../application/DTOs/user/CompetitionDTOSoloPlay";
export class CreateSoloPlayUseCase implements ICreateSoloPlayUseCase {
  constructor(
    private lessonRepository: ILessonRepository,
    private _baseRepoCompetion: ICompetitionRepository,
    private userRepository: IUserRepository,
  ) {}
  async execute(userId: string): Promise<CompetitionDTOSoloPlay> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.AUTH_USER_NOT_FOUND,
      );
    }
    const Lessons = await this.lessonRepository.find();
    if (!Lessons) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.LESSON_NOT_FOUND,
      );
    }
    const selectedLesson = Lessons[Math.floor(Math.random() * Lessons.length)];
    const competition = new CompetitionEntity({
      type: "solo",
      mode: "global",
      participants: [(user as any)._id],
      textId: (selectedLesson as any)._id || (selectedLesson as any).id,
      duration: 300,
      countDown: 10,
      status: "ongoing",
    });
    const createdCompetition =
      await this._baseRepoCompetion.create(competition);

    const populatedParticipants = await Promise.all(
      (competition as any).participants.map((item: any) =>
        this.userRepository.findById(item),
      ),
    );
    const responseCompetition = {
      ...(createdCompetition as any),
      participants: populatedParticipants,
      lesson: selectedLesson,
    };

    return mapCompetitionToDTOSoloPlay(responseCompetition);
  }
}
