import { NotificationResponseDTO } from '../../DTOs/companyUser/notification.dto';

export const mapNotificationToResponseDTO = (receipt: any): NotificationResponseDTO => {
  const notification = receipt.notificationId;
  return {
    id: receipt._id?.toString() || receipt.id,
    title: notification?.title || '',
    message: notification?.message || '',
    type: notification?.type || 'individual',
    isRead: receipt.isRead,
    createdAt: receipt.createdAt,
  };
};
