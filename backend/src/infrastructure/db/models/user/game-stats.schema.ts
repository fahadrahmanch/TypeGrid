// models/GameStats.model.ts
import mongoose, { Schema } from "mongoose";
import { IGameStatsDocument } from "../../types/documents";

const GameStatsSchema = new Schema<IGameStatsDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    quickPlay: {
      totalSessions: { type: Number, default: 0 },
      highestWpm: { type: Number, default: 0 },
    },

    soloPlay: {
      totalSessions: { type: Number, default: 0 },
      highestWpm: { type: Number, default: 0 },
      highestAccuracy: { type: Number, default: 0 },
      hasSetPersonalBest: { type: Boolean, default: false },
    },

    groupPlay: {
      totalMatches: { type: Number, default: 0 },
      totalWins: { type: Number, default: 0 },
      currentWinStreak: { type: Number, default: 0 },
    },

    dailyChallenge: {
      totalCompleted: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      perfectMonthCount: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export const GameStatsModel = mongoose.model<IGameStatsDocument>("GameStats", GameStatsSchema);
