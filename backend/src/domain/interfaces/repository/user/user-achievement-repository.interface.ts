import { UserAchievementEntity } from '../../../entities/user-achievement.entity';
import { IBaseRepository } from '../base-repository.interface';

export interface IUserAchievementRepository extends IBaseRepository<UserAchievementEntity> {
  findByUserId(userId: string): Promise<UserAchievementEntity[]>;
  findUnlocked(userId: string, achievementIds: string[]): Promise<string[]>;
}
