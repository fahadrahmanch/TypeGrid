import { IGetChallengeGameDataUseCase } from "../../interfaces/companyUser/get-challenge-game-data.interface";
import { ICompanyChallengeRepository } from "../../../../domain/interfaces/repository/company/company-challenge-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/competition-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
import { ChallengeGameDTO } from "../../../DTOs/companyUser/challenge.dto";
import { mapChallengeGameToDTO } from "../../../mappers/companyUser/challenge.mapper";

/**
 * Use case for retrieving challenge game data.
 */
export class GetChallengeGameDataUseCase implements IGetChallengeGameDataUseCase {
  constructor(
    private readonly _challengeRepository: ICompanyChallengeRepository,
    private readonly _competitionRepository: ICompetitionRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _lessonRepository: ILessonRepository
  ) {}

  /**
   * Get game data for a challenge.
   * @param challengeId - Challenge identifier
   */
  async execute(challengeId: string): Promise<ChallengeGameDTO> {

    if (!challengeId) {
      throw new CustomError(
        HttpStatusCodes.BAD_REQUEST,
        MESSAGES.INVALID_REQUEST
      );
    }

    const challenge = await this._challengeRepository.findById(challengeId);

    if (!challenge) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.CHALLENGE_NOT_FOUND
      );
    }

    const senderId = challenge.senderId.toString();
    const receiverId = challenge.receiverId.toString();
    const competitionId = challenge.competitionId.toString();

    const competition = await this._competitionRepository.findById(competitionId);

    if (!competition) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.COMPETITION_NOT_FOUND
      );
    }

    const updatedCompetition = await this._competitionRepository.updateById(
      competitionId,
      { startedAt: new Date() }
    );

    const [player1, player2, lesson] = await Promise.all([
      this._userRepository.findById(senderId),
      this._userRepository.findById(receiverId),
      this._lessonRepository.findById(competition.textId.toString()),
    ]);

    if (!player1 || !player2) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.PLAYER_NOT_FOUND
      );
    }

    if (!lesson) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.LESSON_NOT_FOUND
      );
    }

    return mapChallengeGameToDTO({
      competition: updatedCompetition,
      lesson,
      players: [player1, player2],
    });
  }
}