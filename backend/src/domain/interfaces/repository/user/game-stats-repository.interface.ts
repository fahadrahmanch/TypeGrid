import { IBaseRepository } from "../base-repository.interface";
import { GameStatsEntity } from "../../../entities/game-stats.entity";

export interface IGameStatsRepository extends IBaseRepository<GameStatsEntity> {
  findByUserId(userId: string): Promise<GameStatsEntity | null>;
}
