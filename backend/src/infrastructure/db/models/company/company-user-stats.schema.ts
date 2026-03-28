import mongoose, { Schema } from "mongoose";
import { ICompanyUserStatsDocument } from "../../types/documents";

const CompanyUserStatsSchema = new Schema(
  {
    userId:        { type: Schema.Types.ObjectId, ref: "User", required: true },
    companyId:     { type: Schema.Types.ObjectId, ref: "Company", required: true },
    totalScore:    { type: Number, default: 0 },
    weeklyScore:   { type: Number, default: 0 },
    monthlyScore:  { type: Number, default: 0 },
    wpm:           { type: Number, default: 0 }, 
    accuracy:      { type: Number, default: 0 }, 
  },
  { timestamps: true }
);

CompanyUserStatsSchema.index({ userId: 1, companyId: 1 }, { unique: true });

export const CompanyUserStats = mongoose.model<ICompanyUserStatsDocument>(
  "CompanyUserStats",
  CompanyUserStatsSchema
);