// models/UserAchievement.model.ts
import mongoose, { Schema } from "mongoose";
import { IUserAchievementDocument } from "../../types/documents";
const UserAchievementSchema = new Schema<IUserAchievementDocument>(
  {
    userId: {
      type:     Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },

    achievementId: {
      type:     String,
      required: true,
    },

    unlockedAt: {
      type:    Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

UserAchievementSchema.index(
  { userId: 1, achievementId: 1 },
  { unique: true }
);

export const UserAchievementModel = mongoose.model<IUserAchievementDocument>(
  "UserAchievement",
  UserAchievementSchema
);