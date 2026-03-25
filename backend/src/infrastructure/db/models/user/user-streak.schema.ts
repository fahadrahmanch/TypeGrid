// src/infrastructure/database/models/user-streak.model.ts

import mongoose, { Schema, Document } from 'mongoose';
import { IUserStreakDocument } from '../../types/documents';



const UserStreakSchema = new Schema<IUserStreakDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastCompletedDate: { type: Date, default: null },
  },
  { timestamps: true }
);

export const UserStreak = mongoose.model<IUserStreakDocument>(
  'UserStreak',
  UserStreakSchema
);