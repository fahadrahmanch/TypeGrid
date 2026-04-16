import { Schema, model } from 'mongoose';
import { INotificationReceiptDocument } from '../../types/documents';

const notificationReceiptSchema = new Schema<INotificationReceiptDocument>(
  {
    notificationId: {
      type: Schema.Types.ObjectId,
      ref: 'Notification',
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

notificationReceiptSchema.index({ notificationId: 1, userId: 1 }, { unique: true });

export const NotificationReceipt = model<INotificationReceiptDocument>(
  'NotificationReceipt',
  notificationReceiptSchema
);
