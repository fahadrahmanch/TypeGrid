export class GameStatsEntity {
  private _id?: string;
  private userId: string;

  private quickPlay: {
    totalSessions: number;
    highestWpm: number;
  };

  private soloPlay: {
    totalSessions: number;
    highestWpm: number;
    highestAccuracy: number;
    hasSetPersonalBest: boolean;
  };

  private groupPlay: {
    totalMatches: number;
    totalWins: number;
    currentWinStreak: number;
  };

  private dailyChallenge: {
    totalCompleted: number;
    currentStreak: number;
    perfectMonthCount: number;
  };

  private createdAt?: Date;
  private updatedAt?: Date;

  constructor(data: {
    _id?: string;
    userId: string;
    quickPlay?: {
      totalSessions: number;
      highestWpm: number;
    };
    soloPlay?: {
      totalSessions: number;
      highestWpm: number;
      highestAccuracy: number;
      hasSetPersonalBest: boolean;
    };
    groupPlay?: {
      totalMatches: number;
      totalWins: number;
      currentWinStreak: number;
    };
    dailyChallenge?: {
      totalCompleted: number;
      currentStreak: number;
      perfectMonthCount: number;
    };
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this._id = data._id;
    this.userId = data.userId;
    this.quickPlay = data.quickPlay || { totalSessions: 0, highestWpm: 0 };
    this.soloPlay = data.soloPlay || {
      totalSessions: 0,
      highestWpm: 0,
      highestAccuracy: 0,
      hasSetPersonalBest: false,
    };
    this.groupPlay = data.groupPlay || {
      totalMatches: 0,
      totalWins: 0,
      currentWinStreak: 0,
    };
    this.dailyChallenge = data.dailyChallenge || {
      totalCompleted: 0,
      currentStreak: 0,
      perfectMonthCount: 0,
    };
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Getters
  getId() {
    return this._id;
  }
  getUserId() {
    return this.userId;
  }
  getQuickPlay() {
    return { ...this.quickPlay };
  }
  getSoloPlay() {
    return { ...this.soloPlay };
  }
  getGroupPlay() {
    return { ...this.groupPlay };
  }
  getDailyChallenge() {
    return { ...this.dailyChallenge };
  }
  getCreatedAt() {
    return this.createdAt;
  }
  getUpdatedAt() {
    return this.updatedAt;
  }

  // Setters/Update Methods
  updateQuickPlay(wpm: number) {
    this.quickPlay.totalSessions += 1;
    if (wpm > this.quickPlay.highestWpm) {
      this.quickPlay.highestWpm = wpm;
    }
  }

  updateSoloPlay(wpm: number, accuracy: number) {
    this.soloPlay.totalSessions += 1;
    if (wpm > this.soloPlay.highestWpm) {
      this.soloPlay.highestWpm = wpm;
      this.soloPlay.hasSetPersonalBest = true;
    }
    if (accuracy > this.soloPlay.highestAccuracy) {
      this.soloPlay.highestAccuracy = accuracy;
    }
  }

  recordMatch(isWin: boolean) {
    this.groupPlay.totalMatches += 1;
    if (isWin) {
      this.groupPlay.totalWins += 1;
      this.groupPlay.currentWinStreak += 1;
    } else {
      this.groupPlay.currentWinStreak = 0;
    }
  }

  completeDailyChallenge() {
    this.dailyChallenge.totalCompleted += 1;
    this.dailyChallenge.currentStreak += 1;
  }

  resetDailyStreak() {
    this.dailyChallenge.currentStreak = 0;
  }

  toObject() {
    return {
      _id: this._id,
      userId: this.userId,
      quickPlay: this.quickPlay,
      soloPlay: this.soloPlay,
      groupPlay: this.groupPlay,
      dailyChallenge: this.dailyChallenge,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
