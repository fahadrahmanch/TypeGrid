import { IMarkNotificationAsReadUseCase } from "../../interfaces/companyUser/mark-notification-as-read.interface";
import { INotificationReceiptRepository } from "../../../../domain/interfaces/repository/company/notification-receipt-repository.interface";
import { CustomError } from "../../../../domain/entities/custom-error.entity";

export class MarkNotificationAsReadUseCase implements IMarkNotificationAsReadUseCase {
    constructor(
        private notificationReceiptRepository: INotificationReceiptRepository
    ) { }

    async execute(receiptId: string): Promise<void> {
        if (!receiptId) {
            throw new CustomError(400, "Receipt ID is required");
        }

        const receipt = await this.notificationReceiptRepository.findById(receiptId);
        if (!receipt) {
            throw new CustomError(404, "Notification not found");
        }

        receipt.markAsRead();
        await this.notificationReceiptRepository.update(receipt.toObject());
    }
}
