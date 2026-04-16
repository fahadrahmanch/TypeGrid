import { GroupNotificationDTO } from '../../../DTOs/companyAdmin/notification.dto';

export interface IGroupNotificationUseCase {
  execute(data: GroupNotificationDTO, senderId: string): Promise<void>;
}
