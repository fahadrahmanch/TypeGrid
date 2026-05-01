import { DailyChallengeStatsDTO } from "../../../../DTOs/user/daily-challenge-stats.dto";

export interface IGetDailyChallengeStatsUseCase {
  execute(userId: string): Promise<DailyChallengeStatsDTO>;
}
