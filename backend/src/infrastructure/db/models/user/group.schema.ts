import { Schema, model } from "mongoose";
import { IGroupDocument } from "../../types/documents";

const groupSchema = new Schema<IGroupDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        type: Schema.Types.ObjectId,
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
    kickedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Group = model<IGroupDocument>("Group", groupSchema);
