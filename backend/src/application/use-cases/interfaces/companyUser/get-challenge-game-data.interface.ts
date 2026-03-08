import { ChallengeGameDTO } from "../../../DTOs/companyUser/challenge.dto";
export interface IGetChallengeGameDataUseCase {
  execute(challengeId: string): Promise<ChallengeGameDTO>;
}
