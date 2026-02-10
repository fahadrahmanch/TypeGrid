import mongoose from "mongoose";

const companyGroupSchema = new mongoose.Schema(
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
      enum: ["beginner", "intermidate", "advanced"],
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
    timestamps: true, // creates createdAt & updatedAt automatically
  }
);

export const CompanyGroup = mongoose.model(
  "CompanyGroup",
  companyGroupSchema
);
