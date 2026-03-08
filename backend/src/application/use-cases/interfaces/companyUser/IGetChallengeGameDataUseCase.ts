import { ChallengeGameDTO } from "../../../DTOs/companyUser/challengeDTO";
export interface IGetChallengeGameDataUseCase {
  execute(challengeId: string): Promise<ChallengeGameDTO>;
}
