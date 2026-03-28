import { CompanyUserStatsEntity } from "../../../entities";

export interface ICompanyUserStatsRepository {
  create(data: any): Promise<CompanyUserStatsEntity>;
  findById(
    id: string,
    options?: {
      populate?: any;
    },
  ): Promise<CompanyUserStatsEntity | null>;
  update(data: any): Promise<CompanyUserStatsEntity | null>;
  find(
    filter?: any,
    options?: {
      populate?: { path: string; select?: string };
      sort?: any;
      limit?: number;
    },
  ): Promise<CompanyUserStatsEntity[]>;
  findOne(filter?: any): Promise<CompanyUserStatsEntity | null>;
  delete(_id: string): Promise<CompanyUserStatsEntity | null>;
  updateById(_id: string, updateQuery: any): Promise<CompanyUserStatsEntity | null>;
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
}
