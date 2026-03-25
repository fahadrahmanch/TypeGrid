export interface CreateChallengeDTO {
  title: string;
  difficulty: "easy" | "medium" | "hard";
  goal: string;
  reward: string;
  duration: number;
  description: string;
}

export interface UpdateChallengeDTO {
  title?: string;
  difficulty?: "easy" | "medium" | "hard";
  goal?: string;
  reward?: string;
  duration?: number;
  description?: string;
}

export interface ChallengeResponseDTO {
  _id?: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  goal: string;
  reward: string;
  duration: number;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}
