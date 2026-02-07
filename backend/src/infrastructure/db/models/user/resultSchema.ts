import { Schema, model, Types } from "mongoose";

const resultSchema = new Schema(
  {
     type: {
      type: String,
      enum: ["quick", "solo", "group"],
      required: true,
    },
    competitionId: {
      type: Types.ObjectId,
      ref: "Competition",
      required: true,
      index: true,
    },
     
    

    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
result: {
      wpm: { type: Number, required: true },
      accuracy: { type: Number, required: true },
      errors: { type: Number, required: true },
      time: { type: Number, required: true },
      rank: { type: Number, required: false},
    },
   
  },
  { timestamps: true }
);


resultSchema.index({ competitionId: 1, userId: 1 }, { unique: true });

export const Result = model("Result", resultSchema);
