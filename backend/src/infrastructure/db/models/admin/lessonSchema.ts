import mongoose, { Schema } from "mongoose";

const lessonSchema = new Schema(
  {
    title:{
      type: String,
      required: false,
      trim: true
    },
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
 
    wpm: {
      type: Number,
      required: false
    },

    accuracy: {
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
      ref:"Company",
      default: null
    },

    // assignments: [
    //   {
    //     userId: {
    //       type: mongoose.Schema.Types.ObjectId
    //     },
    //     assignedAt: {
    //       type: Date
    //     },
    //     expiresAt: {
    //       type: Date
    //     },
    //     status: {
    //       type: String,
    //       enum: ["active", "completed", "expired"],
    //       default: "active"
    //     }
    //   }
    // ]
  },
  {
    timestamps: true
  }
);

export const Lesson = mongoose.model("Lesson", lessonSchema);