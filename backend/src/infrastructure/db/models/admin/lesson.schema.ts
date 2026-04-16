import mongoose, { Schema } from 'mongoose';
import { ILessonDocument } from '../../types/documents';

const lessonSchema = new Schema<ILessonDocument>(
  {
    title: {
      type: String,
      required: false,
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['sentence', 'paragraph'],
      required: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    wpm: {
      type: Number,
      required: false,
    },
    accuracy: {
      type: Number,
      required: false,
    },
    createdBy: {
      type: String,
      enum: ['admin', 'company'],
      default: 'admin',
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Lesson = mongoose.model<ILessonDocument>('Lesson', lessonSchema);
