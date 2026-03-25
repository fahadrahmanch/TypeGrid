export interface CreateGoalDTO {
  title: string;
  wpm: number;
  accuracy: number;
  description: string;
}

export interface UpdateGoalDTO {
  title?: string;
  wpm?: number;
  accuracy?: number;
  description?: string;
}

export interface GoalResponseDTO {
  _id?: string;
  title: string;
  wpm: number;
  accuracy: number;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}
