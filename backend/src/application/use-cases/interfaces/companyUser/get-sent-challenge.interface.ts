import { SentChallengeDTO } from "../../../DTOs/companyUser/challenge.dto";

export interface IGetSentChallengeUseCase {
  execute(userId: string): Promise<SentChallengeDTO[]>;
}
