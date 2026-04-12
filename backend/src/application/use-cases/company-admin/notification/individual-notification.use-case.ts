import { IIndividualNotificationUseCase } from "../../interfaces/companyAdmin/individual-notification.interface";
import { IndividualNotificationDTO } from "../../../DTOs/companyAdmin/notification.dto";
import { INotificationRepository } from "../../../../domain/interfaces/repository/company/notification-repository.interface";
import { INotificationReceiptRepository } from "../../../../domain/interfaces/repository/company/notification-receipt-repository.interface";
import { NotificationEntity } from "../../../../domain/entities/company/notification.entity";
import { NotificationReceiptEntity } from "../../../../domain/entities/company/notification-receipt.entity";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { CustomError } from "../../../../domain/entities/custom-error.entity";

export class IndividualNotificationUseCase implements IIndividualNotificationUseCase {
    constructor(
        private notificationRepository: INotificationRepository,
        private notificationReceiptRepository: INotificationReceiptRepository,
        private userRepository: IUserRepository,
    ) { }

    async execute(data: IndividualNotificationDTO, senderId: string): Promise<void> {
        const { title, message, selectedUsers } = data;
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
            type: "individual",
            title,
            message,
        });

        const savedNotification = await this.notificationRepository.create(notification.toObject());

        const receipts = selectedUsers.map(userId =>
            new NotificationReceiptEntity({
                notificationId: savedNotification.getId()!,
                userId,
            })
        );

        await this.notificationReceiptRepository.insertMany(receipts);
    }
}