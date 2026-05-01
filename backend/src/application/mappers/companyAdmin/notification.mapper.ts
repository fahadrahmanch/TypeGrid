import { NotificationEntity } from "../../../domain/entities/company/notification.entity";
import { IndividualNotificationDTO, NotificationHistoryDTO } from "../../DTOs/companyAdmin/notification.dto";

export const mapNotificationToIndividualDTO = (entity: NotificationEntity): IndividualNotificationDTO => {
  return {
    title: entity.getTitle(),
    message: entity.getMessage(),
    selectedUsers: entity.getTargetId() ? [entity.getTargetId()!] : [],
  };
};

export const mapNotificationToHistoryDTO = (entity: any): NotificationHistoryDTO => {
  return {
    id: entity._id?.toString() || entity.id,
    title: entity.title || entity.getTitle?.() || "",
    message: entity.message || entity.getMessage?.() || "",
    type: entity.type || entity.getType?.() || "individual",
    targetId: entity.targetId?.toString() || entity.getTargetId?.()?.toString() || null,
    createdAt: entity.createdAt,
  };
};
