import { INotificationDocument } from '../types/documents';
import { NotificationEntity } from '../../../domain/entities/company/notification.entity';

export class NotificationMapper {
  static toDomain(doc: INotificationDocument): NotificationEntity {
    return new NotificationEntity({
      _id: doc._id?.toString(),
      companyId: doc.companyId.toString(),
      senderId: doc.senderId.toString(),
      type: doc.type,
      targetId: doc.targetId ? doc.targetId.toString() : null,
      title: doc.title,
      message: doc.message,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
