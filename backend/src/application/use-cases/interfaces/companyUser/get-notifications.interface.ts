import { NotificationResponseDTO } from '../../../DTOs/companyUser/notification.dto';

export interface IGetNotificationsUseCase {
  execute(userId: string): Promise<NotificationResponseDTO[]>;
}
