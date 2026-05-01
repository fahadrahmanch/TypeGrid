import { CompanyUserStatsEntity } from "../../../entities";
import { IBaseRepository } from "../base-repository.interface";
export interface ICompanyUserStatsRepository extends IBaseRepository<CompanyUserStatsEntity> {
  getLeaderboard(companyId: string, limit: number): Promise<CompanyUserStatsEntity[]>;
  updateStats(
    companyId: string,
    userId: string,
    data: {
      wpm: number;
      accuracy: number;
      totalScore?: number;
      weeklyScore?: number;
      monthlyScore?: number;
    }
  ): Promise<void>;
  getCompanyUserStatsBasedOnCriteria(
    companyId: string,
    minWpm: number,
    maxWpm: number,
    minAccuracy: number,
    maxAccuracy: number
  ): Promise<string[]>;
}
