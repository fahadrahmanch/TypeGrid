import { IAchievementRepository } from '../../domain/interfaces/repository/user/achievement-repository.interface';
import { IUserAchievementRepository } from '../../domain/interfaces/repository/user/user-achievement-repository.interface';
import { IAchievementService } from '../../domain/interfaces/services/acheivment-service.interface';
import { IStatsRepository } from '../../domain/interfaces/repository/user/stats-repository.interface';
import { UserAchievementEntity } from '../../domain/entities/user-achievement.entity';
export class AchievementService implements IAchievementService {
  constructor(
    private achievementRepo: IAchievementRepository,
    private userAchievementRepo: IUserAchievementRepository,
    private statsRepo: IStatsRepository
  ) {}

  async checkAndUnlockAchievements(userId: string): Promise<any> {
    const stats = await this.statsRepo.findOne({ userId: userId });
    let wpm = 0;
    let accuracy = 0;
    let totalGamesPlayed = 0;
    if (!stats) {
      wpm = 0;
      accuracy = 0;
      totalGamesPlayed = 0;
    } else {
      wpm = stats.getWpm();
      accuracy = stats.getAccuracy();
      totalGamesPlayed = stats.getTotalCompetitions();
    }

    const eligibleAchievements = await this.achievementRepo.findEligible({
      wpm,
      accuracy,
      totalGamesPlayed,
    });
    if (!eligibleAchievements.length) return [];

    const unlockedIds = await this.userAchievementRepo.findUnlocked(
      userId,
      eligibleAchievements.map((a) => a.getId()!)
    );
    const unlockedSet = new Set(unlockedIds);

    const newAchievements = eligibleAchievements.filter((a) => !unlockedSet.has(a.getId()!));

    if (!newAchievements.length) return [];
    const savePromises = newAchievements.map((a) => {
      const userAchievement = new UserAchievementEntity({
        userId,
        achievementId: a.getId()!,
        unlockedAt: new Date(),
      });
      return this.userAchievementRepo.create(userAchievement.toObject());
    });
    await Promise.all(savePromises);
    return newAchievements.map((a) => ({
      achievementId: a.getId(),
      title: a.title,
      xp: a.xp,
    }));
  }
}
