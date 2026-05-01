import { ChallengeDTO } from "../../../DTOs/companyUser/challenge.dto";

export interface IMakeChallengeUseCase {
  execute(senderId: string, receiverId: string): Promise<ChallengeDTO>;
}
