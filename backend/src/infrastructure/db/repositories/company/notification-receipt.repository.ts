import { Model } from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { INotificationReceiptRepository } from "../../../../domain/interfaces/repository/company/notification-receipt-repository.interface";
import { INotificationReceiptDocument } from "../../types/documents";
import { NotificationReceiptEntity } from "../../../../domain/entities/company/notification-receipt.entity";
import { NotificationReceiptMapper } from "../../mappers/notification-receipt.mapper";

export class NotificationReceiptRepository
  extends BaseRepository<INotificationReceiptDocument, NotificationReceiptEntity>
  implements INotificationReceiptRepository
{
  constructor(model: Model<INotificationReceiptDocument>) {
    super(model, NotificationReceiptMapper.toDomain);
  }

  async insertMany(data: NotificationReceiptEntity[]): Promise<void> {
    await this.model.insertMany(data);
  }
}
