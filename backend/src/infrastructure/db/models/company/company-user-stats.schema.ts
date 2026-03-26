import mongoose, { Schema } from "mongoose";
import { ICompanyUserStatsDocument } from "../../types/documents";

const CompanyUserStatsSchema = new Schema({
  userId:        { type: Schema.Types.ObjectId, ref: "User" },
  companyId:     { type: Schema.Types.ObjectId, ref: "Company" },
  wpm:           { type: Number, default: 0 },
  accuracy:      { type: Number, default: 0 },
}, { timestamps: true });

export const CompanyUserStats = mongoose.model<ICompanyUserStatsDocument>("CompanyUserStats", CompanyUserStatsSchema);