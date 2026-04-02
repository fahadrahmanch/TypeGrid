import { Model } from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { ICompanyUserStatsRepository } from "../../../../domain/interfaces/repository/company/company-user-stats-repository.interface";
import { ICompanyUserStatsDocument } from "../../types/documents";
import { CompanyUserStatsEntity } from "../../../../domain/entities";
import { CompanyUserStatsMapper } from "../../mappers/company-user-stats.mapper";

export class CompanyUserStatsRepository
  extends BaseRepository<ICompanyUserStatsDocument, CompanyUserStatsEntity>
  implements ICompanyUserStatsRepository
{
  constructor(model: Model<ICompanyUserStatsDocument>) {
    super(model, CompanyUserStatsMapper.toDomain);
  }

  async getLeaderboard(
    companyId: string,
    limit: number,
  ): Promise<CompanyUserStatsEntity[]> {
    const rawStats = await this.model
      .find({ companyId })
      .sort({ wpm: -1, accuracy: -1 })
      .limit(limit)
      .lean<ICompanyUserStatsDocument[]>()
      .exec();

    return rawStats.map((doc) => this.toDomain(doc));
  }

  async updateStats(
    companyId: string,
    userId: string,
    data: {
      wpm: number;
      accuracy: number;
      totalScore?: number;
      weeklyScore?: number;
      monthlyScore?: number;
    },
  ): Promise<void> {
    const {
      wpm,
      accuracy,
      totalScore = 0,
      weeklyScore = 0,
      monthlyScore = 0,
    } = data;

    await this.model
      .findOneAndUpdate(
        { companyId, userId },
        {
          $inc: {
            totalScore,
            weeklyScore,
            monthlyScore,
          },
          $max: {
            wpm,
            accuracy,
          },
        },
        {
          upsert: true,
          new: true,
        },
      )
      .exec();
  }
}
