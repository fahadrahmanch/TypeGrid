import { IStartChallengeUseCase } from "../../interfaces/companyUser/start-challenge.interface";
import { ICompanyChallengeRepository } from "../../../../domain/interfaces/repository/company/company-challenge-repository.interface";
import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/competition-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";

export class StartChallengeUseCase implements IStartChallengeUseCase {
  constructor(
    private challengeRepository: ICompanyChallengeRepository,
    private competitionRepository: ICompetitionRepository,
  ) {}

  async execute(challengeId: string): Promise<void> {
    const challenge = await this.challengeRepository.findById(challengeId);

    if (!challenge) {
      throw new Error(MESSAGES.CHALLENGE_NOT_FOUND);
    }
    const competitionId = (challenge as any).competitionId;
    if (!competitionId) {
      throw new Error(MESSAGES.COMPETITION_NOT_FOUND_FOR_CHALLENGE);
    }

    const competition =
      await this.competitionRepository.findById(competitionId);

    if (!competition) {
      throw new Error(MESSAGES.COMPETITION_NOT_FOUND);
    }

    if ((competition as any).status !== "ongoing") {
      await this.competitionRepository.updateById(competitionId, {
        status: "ongoing",
      });
    }
  }
}
