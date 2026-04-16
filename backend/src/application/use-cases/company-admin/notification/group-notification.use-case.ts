import { IGroupNotificationUseCase } from '../../interfaces/companyAdmin/group-notification.interface';
import { GroupNotificationDTO } from '../../../DTOs/companyAdmin/notification.dto';
import { INotificationRepository } from '../../../../domain/interfaces/repository/company/notification-repository.interface';
import { INotificationReceiptRepository } from '../../../../domain/interfaces/repository/company/notification-receipt-repository.interface';
import { NotificationEntity } from '../../../../domain/entities/company/notification.entity';
import { NotificationReceiptEntity } from '../../../../domain/entities/company/notification-receipt.entity';
import { IUserRepository } from '../../../../domain/interfaces/repository/user/user-repository.interface';
import { ICompanyGroupRepository } from '../../../../domain/interfaces/repository/company/company-group-repository.interface';
import { CustomError } from '../../../../domain/entities/custom-error.entity';
import { HttpStatusCodes } from '../../../../domain/enums/http-status-codes.enum';
import { MESSAGES } from '../../../../domain/constants/messages';

export class GroupNotificationUseCase implements IGroupNotificationUseCase {
  constructor(
    private notificationRepository: INotificationRepository,
    private notificationReceiptRepository: INotificationReceiptRepository,
    private userRepository: IUserRepository,
    private groupRepository: ICompanyGroupRepository
  ) {}

  async execute(data: GroupNotificationDTO, senderId: string): Promise<void> {
    const { title, message, selectedGroup } = data;
    const sender = await this.userRepository.findById(senderId);
    if (!sender) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.SENDER_NOT_FOUND);
    }
    const companyId = sender.CompanyId;
    if (!companyId) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.COMPANY_NOT_FOUND);
    }

    const notification = new NotificationEntity({
      companyId,
      senderId,
      type: 'group',
      title,
      targetId: selectedGroup,
      message,
    });

    const savedNotification = await this.notificationRepository.create(notification.toObject());

    const recipientIds = new Set<string>();
    const group = await this.groupRepository.findById(selectedGroup);
    if (!group) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.GROUP_NOT_FOUND);
    }
    const members = group.getMembers();
    members.forEach((member: string) => {
      recipientIds.add(member.toString());
    });

    const receipts = Array.from(recipientIds).map(
      (userId) =>
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
