import { IMarkNotificationAsReadUseCase } from "../../interfaces/companyUser/mark-notification-as-read.interface";
import { INotificationReceiptRepository } from "../../../../domain/interfaces/repository/company/notification-receipt-repository.interface";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { MESSAGES } from "../../../../domain/constants/messages";

export class MarkNotificationAsReadUseCase implements IMarkNotificationAsReadUseCase {
  constructor(private notificationReceiptRepository: INotificationReceiptRepository) {}

  async execute(receiptId: string): Promise<void> {
    if (!receiptId) {
      throw new CustomError(HttpStatusCodes.BAD_REQUEST, MESSAGES.RECEIPT_ID_REQUIRED);
    }

    const receipt = await this.notificationReceiptRepository.findById(receiptId);
    if (!receipt) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.NOTIFICATION_NOT_FOUND);
    }

    receipt.markAsRead();
    await this.notificationReceiptRepository.update(receipt.toObject());
  }
}
