import { Schema, model } from "mongoose";
import { IDiscussionDocument } from "../../types/documents";

const DiscussionSchema = new Schema<IDiscussionDocument>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Discussion = model<IDiscussionDocument>("Discussion", DiscussionSchema);
