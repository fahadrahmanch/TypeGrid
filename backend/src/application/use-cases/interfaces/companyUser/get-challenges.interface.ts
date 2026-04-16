import { ChallengeDTO } from '../../../DTOs/companyUser/challenge.dto';
export interface IGetChallengesUseCase {
  execute(userId: string): Promise<ChallengeDTO[]>;
}
