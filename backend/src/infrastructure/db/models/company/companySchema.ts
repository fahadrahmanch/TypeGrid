import { Schema, model } from "mongoose";
import { companyEntity } from "../../../../domain/entities/CompanyEntiriy";

const companySchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    OwnerId: {
      type: Schema.Types.ObjectId,
      ref: "User",   
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    address:{
      type:String,
      require:true
    },
    number:{
      type:String,
      require:true
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

export const Company = model<companyEntity>("Company", companySchema);
