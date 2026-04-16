import { Schema, model } from 'mongoose';
import { IContestDocument } from '../../types/documents';

const contestSchema = new Schema<IContestDocument>(
  {
    contestMode: {
      type: String,
      enum: ['open', 'group'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
    },
    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'CompanyGroup',
      default: null,
    },
    textSource: {
      type: String,
      enum: ['manual', 'random'],
      required: true,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    contestText: {
      type: String,
      required: function (this: IContestDocument) {
        return this.textSource === 'manual';
      },
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: Date,
    },
    duration: {
      type: Number,
      required: true,
      min: 10,
    },
    maxParticipants: {
      type: Number,
      required: true,
      min: 1,
    },
    rewards: [
      {
        rank: { type: Number, required: true },
        prize: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'waiting'],
      default: 'upcoming',
    },
    countDown: {
      type: Number,
      required: false,
      default: 10,
    },
    startedAt: {
      type: Date,
      default: Date.now,
      required: false,
    },
    CompanyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
  },
  { timestamps: true }
);

export const Contest = model<IContestDocument>('Contest', contestSchema);
