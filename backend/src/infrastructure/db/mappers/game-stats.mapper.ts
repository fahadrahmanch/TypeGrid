import { IGameStatsDocument } from '../types/documents';
import { GameStatsEntity } from '../../../domain/entities/game-stats.entity';

export class GameStatsMapper {
  static toDomain(doc: IGameStatsDocument): GameStatsEntity {
    return new GameStatsEntity({
      _id: doc._id?.toString(),
      userId: doc.userId.toString(),
      quickPlay: doc.quickPlay,
      soloPlay: doc.soloPlay,
      groupPlay: doc.groupPlay,
      dailyChallenge: doc.dailyChallenge,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
