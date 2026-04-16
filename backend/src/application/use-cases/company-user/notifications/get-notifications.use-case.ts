import { IGetNotificationsUseCase } from '../../interfaces/companyUser/get-notifications.interface';
import { NotificationResponseDTO } from '../../../DTOs/companyUser/notification.dto';
import { INotificationRepository } from '../../../../domain/interfaces/repository/company/notification-repository.interface';
import { INotificationReceiptRepository } from '../../../../domain/interfaces/repository/company/notification-receipt-repository.interface';
import { mapNotificationToResponseDTO } from '../../../mappers/companyUser/notification.mapper';
import { CustomError } from '../../../../domain/entities/custom-error.entity';
import { HttpStatusCodes } from '../../../../domain/enums/http-status-codes.enum';
import { MESSAGES } from '../../../../domain/constants/messages';

export class GetNotificationsUseCase implements IGetNotificationsUseCase {
  constructor(
    private notificationRepository: INotificationRepository,
    private notificationReceiptRepository: INotificationReceiptRepository
  ) {}

  async execute(userId: string): Promise<NotificationResponseDTO[]> {
    if (!userId) {
      throw new CustomError(HttpStatusCodes.BAD_REQUEST, MESSAGES.USER_ID_REQUIRED);
    }

    const receipts = await this.notificationReceiptRepository.find({ userId });

    const notificationsWithReceipts = await Promise.all(
      receipts.map(async (receipt) => {
        const notification = await this.notificationRepository.findById(receipt.getNotificationId());
        return {
          ...receipt.toObject(),
          notificationId: notification?.toObject() || null,
        };
      })
    );
    notificationsWithReceipts.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    return notificationsWithReceipts.map(mapNotificationToResponseDTO);
  }
}
