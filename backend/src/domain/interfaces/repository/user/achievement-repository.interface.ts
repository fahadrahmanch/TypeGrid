import { IBaseRepository } from "../base-repository.interface";
import { AchievementEntity } from "../../../entities/achievement.entity";

export interface IAchievementRepository extends IBaseRepository<AchievementEntity> {
  findByUserId(userId: string): Promise<AchievementEntity[]>;
}
