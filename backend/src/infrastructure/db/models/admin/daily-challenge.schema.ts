import mongoose, { Schema } from "mongoose";
import { IDailyChallengeDocument } from "../../types/documents";

const DailyChallengeSchema = new Schema<IDailyChallengeDocument>(
  {
    challengeId: {
      type: Schema.Types.ObjectId,
      ref: "AdminChallenge",
      required: true,
    },
    date: { type: Date, required: true, unique: true },
  },
  { timestamps: true }
);

export const DailyChallenge = mongoose.model<IDailyChallengeDocument>("DailyChallenge", DailyChallengeSchema);
