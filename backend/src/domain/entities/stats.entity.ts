
export class StatsEntity {
  private _id?: string;
  private userId: string;
  private totalXp: number;
  private totalCompetitions: number;
  private totalScore: number;
  private weeklyScore: number;
  private monthlyScore: number;
  private wpm: number;
  private accuracy: number;
  private level: number;

  constructor(data: {
    _id?: string;
    userId: string;
    totalXp?: number;
    totalCompetitions?: number;
    wpm?: number;
    accuracy?: number;
    level?: number;
    totalScore?: number;
    weeklyScore?: number;
    monthlyScore?: number;
  }) {
    this._id = data._id;
    this.userId = data.userId;
    this.totalXp = data.totalXp ?? 0;
    this.totalCompetitions = data.totalCompetitions ?? 0;
    this.totalScore = data.totalScore ?? 0;
    this.weeklyScore = data.weeklyScore ?? 0;
    this.monthlyScore = data.monthlyScore ?? 0;
    this.wpm = data.wpm ?? 0;
    this.accuracy = data.accuracy ?? 0;
    this.level = data.level ?? 1;
  }

  getId() {
    return this._id;
  }

  getUserId() {
    return this.userId;
  }

  getTotalXp() {
    return this.totalXp;
  }

  getLevel() {
    return this.level;
  }

  getTotalCompetitions() {
    return this.totalCompetitions;
  }

  getTotalScore() {
    return this.totalScore;
  }

  getWeeklyScore() {
    return this.weeklyScore;
  }

  getMonthlyScore() {
    return this.monthlyScore;
  }

  getAccuracy() {
    return this.accuracy;
  }

  getWpm() {
    return this.wpm;
  }

  getStats() {
    return {
      _id: this._id,
      userId: this.userId,
      totalXp: this.totalXp,
      totalCompetitions: this.totalCompetitions,
      totalScore: this.totalScore,
      weeklyScore: this.weeklyScore,
      monthlyScore: this.monthlyScore,
      wpm: this.wpm,
      accuracy: this.accuracy,
      level: this.level,
    };
  }

  addXp(xp: number) {
    this.totalXp += xp;
    this.updateLevel();
  }

  incrementCompetitions() {
    this.totalCompetitions += 1;
  }

  updatePerformance(wpm: number, accuracy: number) {
    this.wpm = wpm;
    this.accuracy = accuracy;
  }

  updateScores(score: number) {
    this.totalScore += score;
    this.weeklyScore += score;
    this.monthlyScore += score;
  }

  private updateLevel() {
    this.level = Math.floor(this.totalXp / 100) + 1;
  }

  toObject() {
    return {
      _id: this._id,
      userId: this.userId,
      totalXp: this.totalXp,
      totalCompetitions: this.totalCompetitions,
      totalScore: this.totalScore,
      weeklyScore: this.weeklyScore,
      monthlyScore: this.monthlyScore,
      wpm: this.wpm,
      accuracy: this.accuracy,
      level: this.level,
    };
  }
}