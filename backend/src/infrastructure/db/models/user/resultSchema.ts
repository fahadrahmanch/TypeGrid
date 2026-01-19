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

    wpm: Number,
    accuracy: Number,
    errors: Number,
    timeTaken: Number,
    rank: Number,
  },
  { timestamps: true }
);

resultSchema.index({ competitionId: 1, userId: 1 }, { unique: true });

export const Result = model("Result", resultSchema);
