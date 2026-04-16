
export interface IAchievementService {
  checkAndUnlockAchievements(userId: string): Promise<any[]>;
}