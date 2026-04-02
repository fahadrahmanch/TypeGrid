import mongoose, { Schema } from "mongoose";
import { IGoalDocument } from "../../types/documents";

const GoalSchema = new Schema<IGoalDocument>(
  {
    title: { type: String, required: true },
    wpm: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true },
);

export const Goal = mongoose.model<IGoalDocument>("Goal", GoalSchema);
