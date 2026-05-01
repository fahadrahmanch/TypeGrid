import { IStatsRepository } from "../../../../domain/interfaces/repository/user/stats-repository.interface";
import { StatsEntity } from "../../../../domain/entities/stats.entity";
import { IStatsDocument } from "../../types/documents";
import { BaseRepository } from "../../base/base.repository";
import { StatsMapper } from "../../mappers/stats.mapper";
import { Model } from "mongoose";
export class StatsRepository extends BaseRepository<IStatsDocument, StatsEntity> implements IStatsRepository {
  constructor(model: Model<IStatsDocument>) {
    super(model, StatsMapper.toDomain);
  }

  async findByUserId(userId: string): Promise<StatsEntity | null> {
    const stats = await this.model.findOne({ userId });
    return stats ? StatsMapper.toDomain(stats) : null;
  }
  async updateStats(
    userId: string,
    data: {
      wpm: number;
      accuracy: number;
      totalScore?: number;
      weeklyScore?: number;
      monthlyScore?: number;
      totalCompetitions?: number;
      totalXp?: number;
      level?: number;
    }
  ): Promise<void> {
    const { wpm, accuracy, totalScore = 0, weeklyScore = 0, monthlyScore = 0, totalCompetitions = 0 } = data;

    await this.model
      .findOneAndUpdate(
        { userId },
        {
          $inc: {
            totalScore,
            weeklyScore,
            monthlyScore,
            totalCompetitions,
          },
          $max: {
            wpm,
            accuracy,
          },
        },
        {
          upsert: true,
          new: true,
        }
      )
      .exec();
  }

  async getGlobalLeaderboard(sortBy: string, limit: number): Promise<StatsEntity[]> {
    const rawStats = await this.model
      .find()
      .sort({ [sortBy]: -1, wpm: -1 })
      .limit(limit)
      .lean<IStatsDocument[]>()
      .exec();

    return rawStats.map((doc) => StatsMapper.toDomain(doc));
  }
}
