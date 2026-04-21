
import { Schema, model } from 'mongoose';
import { ICompanyDocument } from '../../types/documents';

const companySchema = new Schema<ICompanyDocument>(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    OwnerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    description: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
    rejectionReason: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending', 'reject','expired'],
      default: 'pending',
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: 'SubscriptionPlan',
      required: false,
    },
    startDate: {
      type: Date,
      required: false,
    },
    endDate: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

export const Company = model<ICompanyDocument>('Company', companySchema);
