import { Schema, model } from "mongoose";
const lessonAssignmentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    lessonId: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },

    status: {
      type: String,
      enum: ["assigned", "progress", "completed", "expired"],
      default: "assigned",
    },

    assignedAt: {
      type: Date,
      default: Date.now,
    },

    deadlineAt: {
      type: Date,
      required: true, 
    },
    companyId:{
      type:Schema.Types.ObjectId,
      ref:"Company",
      required:true
    },

    completedAt: Date,
  },
  { timestamps: true }
);

export const LessonAssignment = model("LessonAssignment", lessonAssignmentSchema);
