type ChallengeProps = {
  _id?: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  goal: string;
  reward: string;
  duration: number;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class ChallengeEntity {
  private _id?: string;
  private title: string;
  private difficulty: "easy" | "medium" | "hard";
  private goal: string;
  private reward: string;
  private duration: number;
  private description: string;
  private createdAt?: Date;
  private updatedAt?: Date;

  constructor(attrs: ChallengeProps) {
    this._id = attrs._id;
    this.title = attrs.title;
    this.difficulty = attrs.difficulty;
    this.goal = attrs.goal;
    this.reward = attrs.reward;
    this.duration = attrs.duration;
    this.description = attrs.description;
    this.createdAt = attrs.createdAt;
    this.updatedAt = attrs.updatedAt;
  }

  getId(): string | undefined {
    return this._id;
  }
  getTitle(): string {
    return this.title;
  }
  getDifficulty(): "easy" | "medium" | "hard" {
    return this.difficulty;
  }
  getGoal(): string {
    return this.goal;
  }
  getReward(): string {
    return this.reward;
  }
  getDuration(): number {
    return this.duration;
  }
  getDescription(): string {
    return this.description;
  }
  getCreatedAt(): Date | undefined {
    return this.createdAt;
  }
  getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }

  toObject() {
    return {
      _id: this._id,
      title: this.title,
      difficulty: this.difficulty,
      goal: this.goal,
      reward: this.reward,
      duration: this.duration,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
