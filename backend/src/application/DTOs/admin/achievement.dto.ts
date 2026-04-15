export interface CreateAchievementDTO {
  title: string;
  description: string;
  imageUrl: string;
  minWpm?: number;
  minAccuracy?: number;
  minGame?: number;
  xp: number;
}

export interface AchievementResponseDTO {
  _id?: string;
  title: string;
  description: string;
  imageUrl: string;
  minWpm?: number;
  minAccuracy?: number;
  minGame?: number;
  xp: number;
  createdAt?: Date;
  updatedAt?: Date;
}
