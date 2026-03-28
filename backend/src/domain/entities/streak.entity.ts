export type StreakProps = {
  _id?: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export class StreakEntity {
  private _id?: string;
  private userId: string;
  private currentStreak: number;
  private longestStreak: number;
  private lastCompletedDate: Date | null;
  private createdAt?: Date;
  private updatedAt?: Date;

  constructor(attrs: StreakProps) {
    this._id = attrs._id;
    this.userId = attrs.userId;
    this.currentStreak = attrs.currentStreak;
    this.longestStreak = attrs.longestStreak;
    this.lastCompletedDate = attrs.lastCompletedDate;
    this.createdAt = attrs.createdAt;
    this.updatedAt = attrs.updatedAt;
  }

  setCurrentStreak(currentStreak: number) { this.currentStreak = currentStreak; }
  setLongestStreak(longestStreak: number) { this.longestStreak = longestStreak; }
  setLastCompletedDate(lastCompletedDate: Date | null) { this.lastCompletedDate = lastCompletedDate; }
  setUpdatedAt(updatedAt: Date) { this.updatedAt = updatedAt; }

  getId(): string | undefined { return this._id; }
  getUserId(): string { return this.userId; }
  getCurrentStreak(): number { return this.currentStreak; }
  getLongestStreak(): number { return this.longestStreak; }
  getLastCompletedDate(): Date | null { return this.lastCompletedDate; }
  getCreatedAt(): Date | undefined { return this.createdAt; }
  getUpdatedAt(): Date | undefined { return this.updatedAt; }

  toObject() {
    return {
      _id: this._id,
      userId: this.userId,
      currentStreak: this.currentStreak,
      longestStreak: this.longestStreak,
      lastCompletedDate: this.lastCompletedDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
