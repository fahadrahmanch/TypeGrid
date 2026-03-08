import { IGetChallengeGameDataUseCase } from "../../interfaces/companyUser/IGetChallengeGameDataUseCase";
import { ICompanyChallengeRepository } from "../../../../domain/interfaces/repository/company/ICompanyChallengeRepository";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/customError";
import { HttpStatusCodes } from "../../../../domain/enums/httpStatusCodes";
import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/ICompetitionRepository";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/IUserRepository";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/ILessonRepository";
import {
  ChallengeGameDTO,
  mapChallengeGameToDTO,
} from "../../../DTOs/companyUser/challengeDTO";

export class GetChallengeGameDataUseCase implements IGetChallengeGameDataUseCase {
  constructor(
    private challengeRepository: ICompanyChallengeRepository,
    private competitionRepository: ICompetitionRepository,
    private userRepository: IUserRepository,
    private lessonRepository: ILessonRepository,
  ) {}

  async execute(challengeId: string): Promise<ChallengeGameDTO> {
    const challenge = await this.challengeRepository.findById(challengeId);

    if (!challenge) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.CHALLENGE_NOT_FOUND,
      );
    }

    const senderId = (challenge as any).senderId.toString();
    const receiverId = (challenge as any).receiverId.toString();
    const competitionId = (challenge as any).competitionId.toString();

    const competition =
      await this.competitionRepository.findById(competitionId);

    if (!competition) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.COMPETITION_NOT_FOUND,
      );
    }

    const updatedCompetition = await this.competitionRepository.updateById(
      competitionId,
      {
        startedAt: new Date(),
      },
    );

    const [player1, player2, lesson] = await Promise.all([
      this.userRepository.findById(senderId),
      this.userRepository.findById(receiverId),
      this.lessonRepository.findById((competition as any).textId),
    ]);

    if (!player1 || !player2) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.PLAYER_NOT_FOUND,
      );
    }

    if (!lesson) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.LESSON_NOT_FOUND,
      );
    }

    const players = [player1, player2];

    const data = {
      competition: updatedCompetition,
      lesson,
      players,
    };

    const result = mapChallengeGameToDTO(data);

    return result;
  }
}
