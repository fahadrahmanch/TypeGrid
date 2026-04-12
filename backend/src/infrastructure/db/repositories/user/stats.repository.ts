import { IStatsRepository } from "../../../../domain/interfaces/repository/user/stats-repository.interface";
import { StatsEntity } from "../../../../domain/entities/stats.entity";
import { IStatsDocument } from "../../types/documents";
import { BaseRepository } from "../../base/base.repository";
import { StatsMapper } from "../../mappers/stats.mapper";
import { Model } from "mongoose";
export class StatsRepository
  extends BaseRepository<IStatsDocument, StatsEntity>
  implements IStatsRepository
{
  constructor(model: Model<IStatsDocument>) {
    super(model, StatsMapper.toDomain);
  }

  async findByUserId(userId: string): Promise<StatsEntity | null> {
    const stats = await this.model.findOne({ userId });
    return stats ? StatsMapper.toDomain(stats) : null;
  }
}