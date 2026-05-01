export type DailyChallengeProgressProps = {
  _id?: string;
  userId: string;
  dailyChallengeId: string;
  date: Date;
  status: "not_started" | "in_progress" | "completed" | "failed";
  wpm: number;
  accuracy: number;
  xpEarned: number;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export class DailyChallengeProgressEntity {
  private _id?: string;
  private userId: string;
  private dailyChallengeId: string;
  private date: Date;
  private status: "not_started" | "in_progress" | "completed" | "failed";
  private wpm: number;
  private accuracy: number;
  private xpEarned: number;
  private startedAt: Date | null;
  private completedAt: Date | null;
  private createdAt?: Date;
  private updatedAt?: Date;

  constructor(attrs: DailyChallengeProgressProps) {
    this._id = attrs._id;
    this.userId = attrs.userId;
    this.dailyChallengeId = attrs.dailyChallengeId;
    this.date = attrs.date;
    this.status = attrs.status;
    this.wpm = attrs.wpm;
    this.accuracy = attrs.accuracy;
    this.xpEarned = attrs.xpEarned;
    this.startedAt = attrs.startedAt;
    this.completedAt = attrs.completedAt;
    this.createdAt = attrs.createdAt;
    this.updatedAt = attrs.updatedAt;
  }

  setStatus(status: "not_started" | "in_progress" | "completed" | "failed") {
    this.status = status;
  }
  setWpm(wpm: number) {
    this.wpm = wpm;
  }
  setAccuracy(accuracy: number) {
    this.accuracy = accuracy;
  }
  setXpEarned(xpEarned: number) {
    this.xpEarned = xpEarned;
  }
  setStartedAt(startedAt: Date) {
    this.startedAt = startedAt;
  }
  setCompletedAt(completedAt: Date) {
    this.completedAt = completedAt;
  }
  setUpdatedAt(updatedAt: Date) {
    this.updatedAt = updatedAt;
  }

  getId(): string | undefined {
    return this._id;
  }
  getUserId(): string {
    return this.userId;
  }
  getDailyChallengeId(): string {
    return this.dailyChallengeId;
  }
  getDate(): Date {
    return this.date;
  }
  getStatus(): "not_started" | "in_progress" | "completed" | "failed" {
    return this.status;
  }
  getWpm(): number {
    return this.wpm;
  }
  getAccuracy(): number {
    return this.accuracy;
  }
  getXpEarned(): number {
    return this.xpEarned;
  }
  getStartedAt(): Date | null {
    return this.startedAt;
  }
  getCompletedAt(): Date | null {
    return this.completedAt;
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
      userId: this.userId,
      dailyChallengeId: this.dailyChallengeId,
      date: this.date,
      status: this.status,
      wpm: this.wpm,
      accuracy: this.accuracy,
      xpEarned: this.xpEarned,
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
