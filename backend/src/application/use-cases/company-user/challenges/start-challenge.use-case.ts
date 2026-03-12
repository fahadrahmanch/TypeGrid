import { IStartChallengeUseCase } from "../../interfaces/companyUser/start-challenge.interface";
import { ICompanyChallengeRepository } from "../../../../domain/interfaces/repository/company/company-challenge-repository.interface";
import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/competition-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";

/**
 * Use case for starting a challenge competition.
 */
export class StartChallengeUseCase implements IStartChallengeUseCase {
  constructor(
    private readonly _challengeRepository: ICompanyChallengeRepository,
    private readonly _competitionRepository: ICompetitionRepository
  ) {}

  /**
   * Start the competition linked to a challenge.
   */
  async execute(challengeId: string): Promise<void> {

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

    const competitionId = challenge.competitionId;

    if (!competitionId) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.COMPETITION_NOT_FOUND_FOR_CHALLENGE
      );
    }

    const competition = await this._competitionRepository.findById(
      competitionId
    );

    if (!competition) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.COMPETITION_NOT_FOUND
      );
    }

    if (competition.status !== "ongoing") {
      await this._competitionRepository.updateById(competitionId, {
        status: "ongoing",
      });
    }
  }
}