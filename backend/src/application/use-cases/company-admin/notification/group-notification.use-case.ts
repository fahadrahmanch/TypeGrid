import { IGroupNotificationUseCase } from "../../interfaces/companyAdmin/group-notification.interface";
import { GroupNotificationDTO } from "../../../DTOs/companyAdmin/notification.dto";
import { INotificationRepository } from "../../../../domain/interfaces/repository/company/notification-repository.interface";
import { INotificationReceiptRepository } from "../../../../domain/interfaces/repository/company/notification-receipt-repository.interface";
import { NotificationEntity } from "../../../../domain/entities/company/notification.entity";
import { NotificationReceiptEntity } from "../../../../domain/entities/company/notification-receipt.entity";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { ICompanyGroupRepository } from "../../../../domain/interfaces/repository/company/company-group-repository.interface";
import { CustomError } from "../../../../domain/entities/custom-error.entity";

export class GroupNotificationUseCase implements IGroupNotificationUseCase {
    constructor(
        private notificationRepository: INotificationRepository,
        private notificationReceiptRepository: INotificationReceiptRepository,
        private userRepository: IUserRepository,
        private groupRepository: ICompanyGroupRepository
    ) { }

    async execute(data: GroupNotificationDTO, senderId: string): Promise<void> {
        const { title, message, selectedGroup } = data;
        console.log(data);
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
            type: "group",
            title,
            targetId:selectedGroup,
            message,
        });

        const savedNotification = await this.notificationRepository.create(notification.toObject());

        const recipientIds = new Set<string>();
        const group=await this.groupRepository.findById(selectedGroup);
        if(!group){
            throw new CustomError(404,"Group not found");
        }
        const members=group.getMembers();
        members.forEach((member:string) => {
            recipientIds.add(member.toString()); 
        });
      

        const receipts = Array.from(recipientIds).map(userId =>
            new NotificationReceiptEntity({
                notificationId: savedNotification.getId()!,
                userId,
            })
        );

        if (receipts.length > 0) {
            await this.notificationReceiptRepository.insertMany(receipts);
        }
    }
}
