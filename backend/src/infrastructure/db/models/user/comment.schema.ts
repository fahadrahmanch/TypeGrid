import { Schema, model } from "mongoose";
import { ICommentDocument } from "../../types/documents";

const CommentSchema = new Schema<ICommentDocument>(
  {
    DiscussionpostId: { type: Schema.Types.ObjectId, ref: "Discussion", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    replies: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Comment = model<ICommentDocument>("Comment", CommentSchema);
