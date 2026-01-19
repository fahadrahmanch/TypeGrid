import { Schema, model, Types } from "mongoose";

const competitionSchema = new Schema(
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

    participants: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],

    groupId: {
      type: Types.ObjectId,
      ref: "Group",
      default: null,
    },
    
    status: {
      type: String,
      enum: ["pending", "ongoing", "completed"],
      default: "pending",
    },

    textId: {
      type: Types.ObjectId,
      ref: "TypingText",
      required: true,
    },

    // countdown: {
    //   type: Number, // seconds
    //   default:60,
    //   required: true,
    // },

    duration: {
      type: Number, // seconds
      default:300,
      required: true,
    },

    reward: [
      {
        rank: Number,
        prize: String,
      },
    ],
     startTime: {
      type: Number, // seconds
      required: true,
      default: 10,
    },
    
    startedAt: {
  type: Date,
  default: Date.now,
}
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

export const Competition = model("Competition", competitionSchema);
