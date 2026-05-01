// src/infrastructure/database/models/streak.model.ts

import mongoose, { Schema } from "mongoose";
import { IStreakDocument } from "../../types/documents";

const StreakSchema = new Schema<IStreakDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastCompletedDate: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Streak = mongoose.model<IStreakDocument>("Streak", StreakSchema);
