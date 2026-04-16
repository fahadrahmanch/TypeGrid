import mongoose, { Schema } from 'mongoose';
import { IRewardDocument } from '../../types/documents';
const RewardSchema = new Schema<IRewardDocument>(
  {
    xp: { type: Number, required: true },
    description: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const Reward = mongoose.model<IRewardDocument>('Reward', RewardSchema);
