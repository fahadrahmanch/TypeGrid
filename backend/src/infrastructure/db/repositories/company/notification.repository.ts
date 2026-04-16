import { Model } from 'mongoose';
import { BaseRepository } from '../../base/base.repository';
import { INotificationRepository } from '../../../../domain/interfaces/repository/company/notification-repository.interface';
import { INotificationDocument } from '../../types/documents';
import { NotificationEntity } from '../../../../domain/entities/company/notification.entity';
import { NotificationMapper } from '../../mappers/notification.mapper';

export class NotificationRepository
  extends BaseRepository<INotificationDocument, NotificationEntity>
  implements INotificationRepository
{
  constructor(model: Model<INotificationDocument>) {
    super(model, NotificationMapper.toDomain);
  }
}
