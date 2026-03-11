import { IAcceptChallengeUseCase } from "../../interfaces/companyUser/accept-challenge.interface";
import { ICompanyChallengeRepository } from "../../../../domain/interfaces/repository/company/company-challenge-repository.interface";
import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/competition-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";

export class AcceptChallengeUseCase implements IAcceptChallengeUseCase {
  constructor(
    private challengeRepository: ICompanyChallengeRepository,
    private competitionRepository: ICompetitionRepository,
  ) {}

  async execute(challengeId: string): Promise<void> {
    const challenge = await this.challengeRepository.findById(challengeId);

    if (!challenge) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.CHALLENGE_NOT_FOUND,
      );
    }

    const challengeEntity = challenge;

    challengeEntity.accept();
    await this.challengeRepository.update(challengeEntity);
  }
}
