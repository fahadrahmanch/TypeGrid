import { Schema, model } from 'mongoose';
import { ICompanyChallengeDocument } from '../../types/documents';

const companyChallengeSchema = new Schema<ICompanyChallengeDocument>(
  {
    CompanyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'completed', 'waiting', 'ongoing'],
      default: 'pending',
    },
    competitionId: { type: Schema.Types.ObjectId, ref: 'Competition' },
  },
  { timestamps: true }
);

export const CompanyChallenge = model<ICompanyChallengeDocument>('CompanyChallenge', companyChallengeSchema);
