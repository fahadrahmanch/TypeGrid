import { Model } from 'mongoose';
import { BaseRepository } from '../../base/base.repository';
import { IGameStatsRepository } from '../../../../domain/interfaces/repository/user/game-stats-repository.interface';
import { IGameStatsDocument } from '../../types/documents';
import { GameStatsEntity } from '../../../../domain/entities/game-stats.entity';
import { GameStatsMapper } from '../../mappers/game-stats.mapper';

export class GameStatsRepository
  extends BaseRepository<IGameStatsDocument, GameStatsEntity>
  implements IGameStatsRepository
{
  constructor(model: Model<IGameStatsDocument>) {
    super(model, GameStatsMapper.toDomain);
  }

  async findByUserId(userId: string): Promise<GameStatsEntity | null> {
    const stats = await this.model.findOne({ userId }).lean<IGameStatsDocument>().exec();
    return stats ? GameStatsMapper.toDomain(stats) : null;
  }
}
