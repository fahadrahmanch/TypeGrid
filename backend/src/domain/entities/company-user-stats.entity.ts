export type CompanyUserStatsProps = {
  _id?: string;
  userId: string;
  companyId: string;
  totalScore: number;
  weeklyScore: number;
  monthlyScore: number;
  wpm: number;
  accuracy: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export class CompanyUserStatsEntity {
  private _id?: string;
  private userId: string;
  private companyId: string;
  private totalScore: number;
  private weeklyScore: number;
  private monthlyScore: number;
  private wpm: number;
  private accuracy: number;
  private createdAt?: Date;
  private updatedAt?: Date;

  constructor(attrs: CompanyUserStatsProps) {
    this._id = attrs._id;
    this.userId = attrs.userId;
    this.companyId = attrs.companyId;
    this.totalScore = attrs.totalScore;
    this.weeklyScore = attrs.weeklyScore;
    this.monthlyScore = attrs.monthlyScore;
    this.wpm = attrs.wpm;
    this.accuracy = attrs.accuracy;
    this.createdAt = attrs.createdAt;
    this.updatedAt = attrs.updatedAt;
  }

  // Getters
  getId(): string | undefined {
    return this._id;
  }
  getUserId(): string {
    return this.userId;
  }
  getCompanyId(): string {
    return this.companyId;
  }
  getTotalScore(): number {
    return this.totalScore;
  }
  getWeeklyScore(): number {
    return this.weeklyScore;
  }
  getMonthlyScore(): number {
    return this.monthlyScore;
  }
  getWpm(): number {
    return this.wpm;
  }
  getAccuracy(): number {
    return this.accuracy;
  }
  getCreatedAt(): Date | undefined {
    return this.createdAt;
  }
  getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }

  // Setters
  setTotalScore(score: number) {
    this.totalScore = score;
  }
  setWeeklyScore(score: number) {
    this.weeklyScore = score;
  }
  setMonthlyScore(score: number) {
    this.monthlyScore = score;
  }
  setWpm(wpm: number) {
    this.wpm = wpm;
  }
  setAccuracy(accuracy: number) {
    this.accuracy = accuracy;
  }
  setUpdatedAt(updatedAt: Date) {
    this.updatedAt = updatedAt;
  }

  toObject(): CompanyUserStatsProps {
    return {
      _id: this._id,
      userId: this.userId,
      companyId: this.companyId,
      totalScore: this.totalScore,
      weeklyScore: this.weeklyScore,
      monthlyScore: this.monthlyScore,
      wpm: this.wpm,
      accuracy: this.accuracy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
