import mongoose from "mongoose";
import { IUserSubscriptionDocument } from "../../types/documents";

const userSubscriptionSchema = new mongoose.Schema<IUserSubscriptionDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subscriptionPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: true,
    },
    planType: {
      type: String,
      enum: ["normal", "company"],
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "expired", "pending"],
      default: "pending",
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },

    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
  },
  { timestamps: true }
);

export const UserSubscription = mongoose.model<IUserSubscriptionDocument>("UserSubscription", userSubscriptionSchema);
