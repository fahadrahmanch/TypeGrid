export class AchievementEntity {
  private _id?: string;
  private userId: string;
  private achievementId: string;
  private unlockedAt: Date;

  constructor(data: {
    _id?: string;
    userId: string;
    achievementId: string;
    unlockedAt?: Date;
  }) {
    this._id = data._id;
    this.userId = data.userId;
    this.achievementId = data.achievementId;
    this.unlockedAt = data.unlockedAt || new Date();
  }

  getId() { return this._id; }
  getUserId() { return this.userId; }
  getAchievementId() { return this.achievementId; }
  getUnlockedAt() { return this.unlockedAt; }

  toObject() {
    return {
      _id: this._id,
      userId: this.userId,
      achievementId: this.achievementId,
      unlockedAt: this.unlockedAt,
    };
  }
}
