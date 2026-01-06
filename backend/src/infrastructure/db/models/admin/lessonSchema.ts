import mongoose, { Schema } from "mongoose";

const lessonSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      enum: ["sentence", "paragraph"],
      required: true
    },

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true
    },
    charCount: {
      type: Number,
      required: false
    },

    wordCount: {
      type: Number,
      required: false
    },
    
    targetWpm: {
      type: Number,
      required: false
    },

    targetAccuracy: {
      type: Number,
      required: false
    },

    createdBy: {
      type: String,
      enum: ["admin", "company"],
      default: "admin"
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },

    assignments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId
        },
        assignedAt: {
          type: Date
        },
        expiresAt: {
          type: Date
        },
        status: {
          type: String,
          enum: ["active", "completed", "expired"],
          default: "active"
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

export const Lesson = mongoose.model("Lesson", lessonSchema);