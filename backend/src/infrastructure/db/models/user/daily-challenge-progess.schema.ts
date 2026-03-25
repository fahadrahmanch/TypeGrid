// src/infrastructure/database/models/daily-challenge-progress.model.ts

import mongoose, { Schema, Document } from 'mongoose';
import { IDailyChallengeProgressDocument } from '../../types/documents';
const DailyChallengeProgressSchema = new Schema<IDailyChallengeProgressDocument>(
  {
    userId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
    challengeId: { type: Schema.Types.ObjectId, ref: 'DailyChallenge', required: true },
    date:        { type: Date, required: true },  // store as start of day (no time)
    status:      { type: String, enum: ['not_started', 'in_progress', 'completed', 'failed'], default: 'not_started'},
    wpm:         { type: Number, default: 0 },
    accuracy:    { type: Number, default: 0 },
    wordsTyped:  { type: Number, default: 0 },
    xpEarned:    { type: Number, default: 0 },
    startedAt:   { type: Date, default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// prevent duplicate attempt for same user + same day
DailyChallengeProgressSchema.index({ userId: 1, date: 1 }, { unique: true });

export const DailyChallengeProgress = mongoose.model<IDailyChallengeProgressDocument>(
  'DailyChallengeProgress',
  DailyChallengeProgressSchema
);