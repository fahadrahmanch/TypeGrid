import { INotificationReceiptDocument } from '../types/documents';
import { NotificationReceiptEntity } from '../../../domain/entities/company/notification-receipt.entity';

export class NotificationReceiptMapper {
  static toDomain(doc: INotificationReceiptDocument): NotificationReceiptEntity {
    return new NotificationReceiptEntity({
      _id: doc._id?.toString(),
      notificationId: doc.notificationId.toString(),
      userId: doc.userId.toString(),
      isRead: doc.isRead,
      readAt: doc.readAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
