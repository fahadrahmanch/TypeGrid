import mongoose from "mongoose";
import { ISubscriptionPlanDocument } from "../../types/documents";

const subscriptionPlanSchema = new mongoose.Schema<ISubscriptionPlanDocument>(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    features: [
      {
        type: String,
      },
    ],

    type: {
      type: String,
      enum: ["normal", "company"],
      required: true,
    },

    userLimit: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

export const SubscriptionPlan = mongoose.model<ISubscriptionPlanDocument>("SubscriptionPlan", subscriptionPlanSchema);
