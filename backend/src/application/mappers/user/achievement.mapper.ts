import { UserAchievementDTO } from "../../DTOs/user/achievement.dto";

export const achievementUserMapper = (data: {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  minWpm?: number;
  minAccuracy?: number;
  minGame?: number;
  xp: number;
  isUnlocked: boolean;
}): UserAchievementDTO => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    imageUrl: data.imageUrl,
    minWpm: data.minWpm,
    minAccuracy: data.minAccuracy,
    minGame: data.minGame,
    xp: data.xp,
    isUnlocked: data.isUnlocked,
  };
};
