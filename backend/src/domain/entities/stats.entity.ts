
export class StatsEntity {
  private _id?: string;
  private userId: string;
  private totalXp: number;
  private totalCompetitions: number;
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
  }) {
    this._id = data._id;
    this.userId = data.userId;
    this.totalXp = data.totalXp ?? 0;
    this.totalCompetitions = data.totalCompetitions ?? 0;
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

  getStats() {
    return {
      _id: this._id,
      userId: this.userId,
      totalXp: this.totalXp,
      totalCompetitions: this.totalCompetitions,
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

  private updateLevel() {
    this.level = Math.floor(this.totalXp / 100) + 1;
  }
  toObject() {
    return {
      _id: this._id,
      userId: this.userId,
      totalXp: this.totalXp,
      totalCompetitions: this.totalCompetitions,
      wpm: this.wpm,
      accuracy: this.accuracy,
      level: this.level,
    };
  }
}