import { INotificationHistoryUseCase } from '../../interfaces/companyAdmin/notification-history.interface';
import { NotificationHistoryDTO } from '../../../DTOs/companyAdmin/notification.dto';
import { INotificationRepository } from '../../../../domain/interfaces/repository/company/notification-repository.interface';
import { IUserRepository } from '../../../../domain/interfaces/repository/user/user-repository.interface';
import { mapNotificationToHistoryDTO } from '../../../mappers/companyAdmin/notification.mapper';
import { CustomError } from '../../../../domain/entities/custom-error.entity';
export class NotificationHistoryUseCase implements INotificationHistoryUseCase {
  constructor(
    private notificationRepository: INotificationRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(senderId: string): Promise<NotificationHistoryDTO[]> {
    const user = await this.userRepository.findById(senderId);
    if (!user) {
      throw new CustomError(404, 'User not found');
    }
    const companyId = user.CompanyId;
    if (!companyId) {
      throw new CustomError(404, 'Company not found');
    }
    const notifications = await this.notificationRepository.find({
      companyId: companyId,
    });
    const notificationHistoryDTOs: NotificationHistoryDTO[] = notifications.map(mapNotificationToHistoryDTO);
    return notificationHistoryDTOs;
  }
}
