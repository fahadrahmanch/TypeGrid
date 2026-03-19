import { Schema, model } from "mongoose";
import { ICompetitionDocument } from "../../types/documents";

const competitionSchema = new Schema<ICompetitionDocument>(
  {
    type: {
      type: String,
      enum: ["quick", "solo", "group", "oneToOne", "company"],
      required: true,
    },
    mode: {
      type: String,
      enum: ["global", "company"],
      required: true,
    },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    groupId: { type: Schema.Types.ObjectId, ref: "Group", default: null },
    startedAt: { type: Date, default: null },
    status: {
      type: String,
      enum: ["pending", "ongoing", "completed"],
      default: "pending",
    },
    textId: { type: Schema.Types.ObjectId, ref: "TypingText" },
    duration: { type: Number, default: 300, required: true },
    reward: [
      {
        rank: { type: Number, required: false },
        prize: { type: Number, required: false },
      },
    ],
    CompanyId: { type: Schema.Types.ObjectId, ref: "Company", default: null },
    countDown: { type: Number, required: true, default: 10 },
  },
  { timestamps: true },
);

export const Competition = model<ICompetitionDocument>("Competition", competitionSchema);
