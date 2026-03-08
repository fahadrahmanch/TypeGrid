import { IAcceptChallengeUseCase } from "../../interfaces/companyUser/IAcceptChallengeUseCase";
import { ICompanyChallengeRepository } from "../../../../domain/interfaces/repository/company/ICompanyChallengeRepository";
import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/ICompetitionRepository";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/customError";
import { HttpStatusCodes } from "../../../../domain/enums/httpStatusCodes";

export class acceptChallengeUseCase implements IAcceptChallengeUseCase {
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
