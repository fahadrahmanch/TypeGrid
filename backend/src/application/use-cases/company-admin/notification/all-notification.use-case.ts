import { IAllNotificationUseCase } from "../../interfaces/companyAdmin/all-notification.interface";
import { AllNotificationDTO } from "../../../DTOs/companyAdmin/notification.dto";
import { INotificationRepository } from "../../../../domain/interfaces/repository/company/notification-repository.interface";
import { INotificationReceiptRepository } from "../../../../domain/interfaces/repository/company/notification-receipt-repository.interface";
import { NotificationEntity } from "../../../../domain/entities/company/notification.entity";
import { NotificationReceiptEntity } from "../../../../domain/entities/company/notification-receipt.entity";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { CustomError } from "../../../../domain/entities/custom-error.entity";

export class AllNotificationUseCase implements IAllNotificationUseCase {
    constructor(
        private notificationRepository: INotificationRepository,
        private notificationReceiptRepository: INotificationReceiptRepository,
        private userRepository: IUserRepository
    ) { }

    async execute(data: AllNotificationDTO, senderId: string): Promise<void> {
        const { title, message } = data;
        const sender = await this.userRepository.findById(senderId);
        if (!sender) {
            throw new CustomError(404, "Sender not found");
        }
        const companyId = sender.CompanyId;
        if (!companyId) {
            throw new CustomError(404, "Company not found");
        }

        const notification = new NotificationEntity({
            companyId,
            senderId,
            type: "all",
            title,
            message,
        });

        const savedNotification = await this.notificationRepository.create(notification.toObject());

        // Get all users for this company
        const users = await this.userRepository.getCompanyUsers("", companyId);

        const receipts = users.map(user =>
            new NotificationReceiptEntity({
                notificationId: savedNotification.getId()!,
                userId: user._id!,
            })
        );

        if (receipts.length > 0) {
            await this.notificationReceiptRepository.insertMany(receipts);
        }
    }
}
