import { AllNotificationDTO } from '../../../DTOs/companyAdmin/notification.dto';

export interface IAllNotificationUseCase {
  execute(data: AllNotificationDTO, senderId: string): Promise<void>;
}
