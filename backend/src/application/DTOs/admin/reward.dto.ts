export interface CreateRewardDTO {
  xp: number;
  description: string;
}

export interface UpdateRewardDTO {
  xp?: number;
  description?: string;
}

export interface RewardResponseDTO {
  _id?: string;
  xp: number;
  description: string;
  // createdAt: Date;
  // updatedAt: Date;
}
