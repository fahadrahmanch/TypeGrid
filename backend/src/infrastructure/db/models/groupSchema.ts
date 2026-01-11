import { Schema, model, Types } from "mongoose";

const groupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    ownerId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    // companyId: {
    //   type: Types.ObjectId,
    //   ref: "Company",
    //   default: null,
    // },

    members: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],

    maximumPlayers: {
      type: Number,
      default: 4,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    joinLink: {
      type: String,
      unique: true,
      sparse: true, 
      default: null, 
    },

    status: {
      type: String,
      enum: ["waiting", "started", "completed"],
      default: "waiting",
    },
  },
  {
    timestamps: true,
  }
);

export const Group = model("Group", groupSchema);
