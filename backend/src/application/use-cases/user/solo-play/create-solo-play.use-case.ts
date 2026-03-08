import { ICreateSoloPlayUseCase } from "../../interfaces/user/solo-play/create-solo-play.interface";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/competition-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { CompetitionEntity } from "../../../../domain/entities/competition.entity";
import { CompetitionDTOSoloPlay } from "../../../../application/DTOs/user/competition-solo-play.dto";
import { mapCompetitionToDTOSoloPlay } from "../../../../application/DTOs/user/competition-solo-play.dto";
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
