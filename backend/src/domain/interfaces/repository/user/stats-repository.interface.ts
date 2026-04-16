import { IBaseRepository } from '../base-repository.interface';
import { StatsEntity } from '../../../../domain/entities/stats.entity';
export interface IStatsRepository extends IBaseRepository<StatsEntity> {
  findByUserId(userId: string): Promise<StatsEntity | null>;
  updateStats(
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
  ): Promise<void>;
  getGlobalLeaderboard(sortBy: string, limit: number): Promise<StatsEntity[]>;
}
