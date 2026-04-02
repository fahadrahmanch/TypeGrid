import mongoose, { Schema } from "mongoose";
import { IAdminChallengeDocument } from "../../types/documents";

const AdminChallengeSchema = new Schema<IAdminChallengeDocument>(
  {
    title: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    goal: { type: Schema.Types.ObjectId, ref: "Goal", required: true },
    reward: { type: Schema.Types.ObjectId, ref: "Reward", required: true },
    duration: { type: Number, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true },
);

export const AdminChallenge = mongoose.model<IAdminChallengeDocument>(
  "AdminChallenge",
  AdminChallengeSchema,
);
