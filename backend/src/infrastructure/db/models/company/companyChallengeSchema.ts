import mongoose from "mongoose";
import { Schema, model, Types } from "mongoose";

const companyChallengeSchema = new mongoose.Schema({
  CompanyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // difficulty: { type: String, enum: ["easy", "medium", "hard"] },
  status: {
    type: String,
    enum: ["pending", "accepted", "declined", "completed","waiting"],
    default: "pending"
  },

  competitionId: { type: mongoose.Schema.Types.ObjectId, ref: "Competition" }
}, { timestamps: true })
export const CompanyChallenge=model("CompanyChallenge",companyChallengeSchema)