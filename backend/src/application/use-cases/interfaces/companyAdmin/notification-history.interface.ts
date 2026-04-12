import { NotificationHistoryDTO } from "../../../DTOs/companyAdmin/notification.dto";

export interface INotificationHistoryUseCase {
  execute(senderId: string): Promise<NotificationHistoryDTO[]>;
}
