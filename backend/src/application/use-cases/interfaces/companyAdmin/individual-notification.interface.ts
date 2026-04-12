import { IndividualNotificationDTO } from "../../../DTOs/companyAdmin/notification.dto";

export interface IIndividualNotificationUseCase {
  execute(data: IndividualNotificationDTO, senderId: string): Promise<void>;
}
