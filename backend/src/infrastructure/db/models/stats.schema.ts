import mongoose, { Schema } from "mongoose";

import { IStatsDocument } from "../types/documents";
const StatsSchema = new Schema<IStatsDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    totalXp: { type: Number, default: 0 },
    totalCompetitions: { type: Number, default:0},
    totalScore: { type: Number, default: 0 },
    weeklyScore: { type: Number, default: 0 },
    monthlyScore: { type: Number, default: 0 },
    wpm: { type: Number, default: 0 },
    accuracy:{type:Number,default:0},
    level: { type: Number, default: 1 },
  },
  { timestamps: true },
);
export const StatsModel = mongoose.model<IStatsDocument>("Stats", StatsSchema);
