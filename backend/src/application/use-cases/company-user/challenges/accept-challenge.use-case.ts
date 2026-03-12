import { IAcceptChallengeUseCase } from "../../interfaces/companyUser/accept-challenge.interface";
import { ICompanyChallengeRepository } from "../../../../domain/interfaces/repository/company/company-challenge-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";

/**
 * Use case for accepting a company challenge.
 */
export class AcceptChallengeUseCase implements IAcceptChallengeUseCase {
  constructor(
    private readonly _challengeRepository: ICompanyChallengeRepository,
  ) {}

  /**
   * Accept a challenge by its ID.
   * @param challengeId - Challenge identifier
   */
  async execute(challengeId: string): Promise<void> {
    const challenge = await this._challengeRepository.findById(challengeId);

    if (!challenge) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.CHALLENGE_NOT_FOUND
      );
    }

    challenge.accept();

    await this._challengeRepository.update(challenge);
  }
}