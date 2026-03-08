import { SentChallengeDTO } from "../../../DTOs/companyUser/challengeDTO";

export interface IGetSentChallengeUseCase {
  execute(userId: string): Promise<SentChallengeDTO[]>;
}
