import { IGetSentChallengeUseCase } from '../../interfaces/companyUser/get-sent-challenge.interface';
import { ICompanyChallengeRepository } from '../../../../domain/interfaces/repository/company/company-challenge-repository.interface';
import { SentChallengeDTO } from '../../../DTOs/companyUser/challenge.dto';
import { mapSentChallengeToDTO } from '../../../mappers/companyUser/challenge.mapper';
import { CustomError } from '../../../../domain/entities/custom-error.entity';
import { HttpStatusCodes } from '../../../../domain/enums/http-status-codes.enum';
import { MESSAGES } from '../../../../domain/constants/messages';

/**
 * Use case for retrieving pending challenges sent by a user.
 */
export class GetSentChallengeUseCase implements IGetSentChallengeUseCase {
  constructor(private readonly _challengeRepository: ICompanyChallengeRepository) {}

  /**
   * Get all pending challenges sent by a user.
   * @param userId - User identifier
   * @returns List of sent challenges
   */
  async execute(userId: string): Promise<SentChallengeDTO[]> {
    if (!userId) {
      throw new CustomError(HttpStatusCodes.BAD_REQUEST, MESSAGES.INVALID_REQUEST);
    }

    const challenges = await this._challengeRepository.find({
      senderId: userId,
      status: 'pending',
    });

    if (!challenges.length) return [];

    return challenges.map((challenge) => mapSentChallengeToDTO(challenge.toObject()));
  }
}
