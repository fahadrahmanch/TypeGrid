import { NotificationReceiptEntity } from "../../../entities/company/notification-receipt.entity";
import { IBaseRepository } from "../base-repository.interface";

export interface INotificationReceiptRepository extends IBaseRepository<NotificationReceiptEntity> {
    insertMany(data: NotificationReceiptEntity[]): Promise<void>;
}
