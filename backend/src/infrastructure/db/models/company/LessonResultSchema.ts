import { Schema, model } from "mongoose";

const LessonResultSchema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: "LessonAssignment",
      required: true,
      unique: true, // prevent duplicate submissions
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    lessonId: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },

    wpm: {
      type: Number,
      required: true,
    },

    accuracy: {
      type: Number,
      required: true,
    },

    errors: {
      type: Number,
      required: true,
    },



    status: {
      type: String,
      enum: ["assigned", "progress", "completed", "expired"],
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const LessonResult = model(
  "LessonResult",
  LessonResultSchema
);