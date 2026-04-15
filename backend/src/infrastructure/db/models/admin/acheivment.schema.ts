// models/UserAchievement.model.ts
import mongoose, { Schema } from "mongoose";
import { IAchievementDocument } from "../../types/documents";
const AchievementSchema = new Schema<IAchievementDocument>(
  {
    title: {
      type:     String,
      required: true,
    },
    description: {
      type:     String,
      required: true,
    },
    imageUrl: {
      type:     String,
      required: true,
    },
    minWpm: {
      type:     Number,
      required: true,
    },
    minAccuracy: {
      type:     Number,
      required: true,
    },
    minGame: {
      type:     Number,
      required: true,
    },
    xp: {
      type:     Number,
      required: true,
    },
    createdAt: {
      type:    Date,
      default: Date.now,
    },
    updatedAt: {
      type:    Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const AchievementModel = mongoose.model<IAchievementDocument>(
  "Achievement",
  AchievementSchema
);