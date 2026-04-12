import { Schema, model } from "mongoose";
import { INotificationDocument } from "../../types/documents";

const notificationSchema = new Schema<INotificationDocument>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["individual", "group", "all"],
      required: true,
    },

    targetId: {
      type: Schema.Types.ObjectId, 
      default: null,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Notification = model<INotificationDocument>("Notification", notificationSchema);