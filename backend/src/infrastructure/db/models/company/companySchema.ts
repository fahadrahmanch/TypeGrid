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
      required: false,
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
    rejectionReason:{
      type:String,
      require:false
    },
    status: {
      type: String,
      enum: ["active", "inactive","pending","reject"],
      default: "active",
    },
  },
  { timestamps: true }
);

export const Company = model<companyEntity>("Company", companySchema);
