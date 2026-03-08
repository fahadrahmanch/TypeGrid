import { IGetSentChallengeUseCase } from "../../interfaces/companyUser/get-sent-challenge.interface";
import { ICompanyChallengeRepository } from "../../../../domain/interfaces/repository/company/company-challenge-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import {
  SentChallengeDTO,
  mapSentChallengeToDTO,
} from "../../../DTOs/companyUser/challenge.dto";

export class GetSentChallengeUseCase implements IGetSentChallengeUseCase {
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
