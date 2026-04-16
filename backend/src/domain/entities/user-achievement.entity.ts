export class UserAchievementEntity {
  private _id?: string;
  private _userId: string;
  private _achievementId: string;
  private _unlockedAt: Date;

  constructor(data: {
    _id?: string;
    userId: string;
    achievementId: string;
    unlockedAt?: Date;
  }) {
    this._id = data._id;
    this._userId = data.userId;
    this._achievementId = data.achievementId;
    this._unlockedAt = data.unlockedAt || new Date();
  }

  // Getters
  get id(): string | undefined { return this._id; }
  get userId(): string { return this._userId; }
  get achievementId(): string { return this._achievementId; }
  get unlockedAt(): Date { return this._unlockedAt; }

  toObject() {
    return {
      _id: this.id,
      userId: this.userId,
      achievementId: this.achievementId,
      unlockedAt: this.unlockedAt,
    };
  }

  getId(): string | undefined {
    return this._id;
  }
}
