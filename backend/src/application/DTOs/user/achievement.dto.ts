export interface UserAchievementDTO {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  minWpm?: number;
  minAccuracy?: number;
  minGame?: number;
  xp: number;
  isUnlocked: boolean;
}
