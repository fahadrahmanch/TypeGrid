import { IBaseRepository } from "../base-repository.interface";
import { AchievementEntity } from "../../../entities/achievement.entity";

export interface IAchievementRepository extends IBaseRepository<AchievementEntity> {
  findByUserId(userId: string): Promise<AchievementEntity[]>;
  findEligible(criteria: { wpm: number; accuracy: number; totalGamesPlayed: number }): Promise<AchievementEntity[]>;
  findAchievements(search: string, limit: number, page: number): Promise<{ achievements: AchievementEntity[]; total: number }>;
}
