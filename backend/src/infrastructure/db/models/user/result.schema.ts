import { Schema, model } from 'mongoose';
import { IResultDocument } from '../../types/documents';

const resultSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['quick', 'solo', 'group', 'contest', 'oneToOne'],
      required: true,
    },
    competitionId: {
      type: Schema.Types.ObjectId,
      ref: 'Competition',
      required: false,
      index: true,
      default: null,
    },
    contestId: {
      type: Schema.Types.ObjectId,
      ref: 'Contest',
      required: false,
      index: true,
      default: null,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    result: {
      wpm: { type: Number, required: true },
      accuracy: { type: Number, required: true },
      errors: { type: Number, required: true },
      time: { type: Number, required: true },
      rank: { type: Number, required: false },
      prize: { type: Number, required: false },
    },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

export const Result = model<IResultDocument>('Result', resultSchema);
