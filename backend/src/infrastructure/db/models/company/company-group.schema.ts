import mongoose from "mongoose";
import { ICompanyGroupDocument } from "../../types/documents";

const companyGroupSchema = new mongoose.Schema<ICompanyGroupDocument>(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const CompanyGroup = mongoose.model<ICompanyGroupDocument>(
  "CompanyGroup",
  companyGroupSchema,
);
