import mongoose from 'mongoose';
import { IPaymentDocument } from '../../types/documents';

const paymentSchema = new mongoose.Schema<IPaymentDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    provider: {
      type: String,
      required: true,
    },
    providerTransactionId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPaymentDocument>('Payment', paymentSchema);
