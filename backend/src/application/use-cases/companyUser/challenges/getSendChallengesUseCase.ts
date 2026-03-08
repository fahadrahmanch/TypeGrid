import { IGetSentChallengeUseCase } from "../../interfaces/companyUser/IGetSentChallengeUseCase";
import { ICompanyChallengeRepository } from "../../../../domain/interfaces/repository/company/ICompanyChallengeRepository";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/IUserRepository";
import {
  SentChallengeDTO,
  mapSentChallengeToDTO,
} from "../../../DTOs/companyUser/challengeDTO";

export class getSentChallengesUseCase implements IGetSentChallengeUseCase {
  constructor(
    private challengeRepository: ICompanyChallengeRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<SentChallengeDTO[]> {
    const challenges = await this.challengeRepository.find({
      senderId: userId,
      status: "pending",
    });

    const mappedChallenges: SentChallengeDTO[] = challenges.map(
      (challenge: any) => mapSentChallengeToDTO(challenge),
    );

    return mappedChallenges;
  }
}
