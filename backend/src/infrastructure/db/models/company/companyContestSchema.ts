import { Schema, model, Types } from "mongoose";

const contestSchema = new Schema(
  {
    contestMode: {
      type: String,
      enum: ["open", "group"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    groupId: {
      type: Types.ObjectId,
      ref: "CompanyGroup",
      default: null,
    },

    textSource: {
      type: String,
      enum: ["manual", "random"],
      required: true,
    },
    participants: [
  {
    type: Types.ObjectId,
    ref: "User",
    
  },
],

    contestText: {
      type: String,
      required: function () {
        return this.textSource === "manual";
      },
    },

    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: Date,
    },

  
    duration: {
      type: Number,
      required: true,
      min: 10,
    },

    maxParticipants: {
      type: Number,
      required: true,
      min: 1,
    },

    rewards: [
      {
        rank: {
          type: Number,
          required: true,
        },
        prize: {
          type: Number,
          required: true,
        },
      },
    ],

    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed","waiting"],
      default: "upcoming",
    },
       countDown: {
      type: Number, // seconds
      required: false,
      default: 10,
    },
       startedAt: {
  type: Date,
  default: Date.now,
  required:false
},
    CompanyId: {
      type: Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  { timestamps: true }
);

export const Contest = model("Contest", contestSchema);
