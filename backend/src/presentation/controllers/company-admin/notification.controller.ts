import { Response } from 'express';
import { AuthRequest } from '../../../types/AuthRequest';
import { IIndividualNotificationUseCase } from '../../../application/use-cases/interfaces/companyAdmin/individual-notification.interface';
import { IGroupNotificationUseCase } from '../../../application/use-cases/interfaces/companyAdmin/group-notification.interface';
import { IAllNotificationUseCase } from '../../../application/use-cases/interfaces/companyAdmin/all-notification.interface';
import { INotificationHistoryUseCase } from '../../../application/use-cases/interfaces/companyAdmin/notification-history.interface';
import {
  IndividualNotificationDTO,
  GroupNotificationDTO,
  AllNotificationDTO,
} from '../../../application/DTOs/companyAdmin/notification.dto';
import { HttpStatus } from '../../constants/httpStatus';
import { MESSAGES } from '../../../domain/constants/messages';
import { CustomError } from '../../../domain/entities/custom-error.entity';

export class NotificationController {
  constructor(
    private individualNotificationUseCase: IIndividualNotificationUseCase,
    private groupNotificationUseCase: IGroupNotificationUseCase,
    private allNotificationUseCase: IAllNotificationUseCase,
    private notificationHistoryUseCase: INotificationHistoryUseCase
  ) {}

  sendIndividualNotification = async (req: AuthRequest, res: Response): Promise<void> => {
    const data: IndividualNotificationDTO = req.body;
    const senderId = req.user?.userId;

    if (!senderId) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);
    }

    await this.individualNotificationUseCase.execute(data, senderId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.NOTIFICATION_SENT_SUCCESS,
    });
  };

  sendGroupNotification = async (req: AuthRequest, res: Response): Promise<void> => {
    const data: GroupNotificationDTO = req.body;
    const senderId = req.user?.userId;

    if (!senderId) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);
    }

    await this.groupNotificationUseCase.execute(data, senderId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.GROUP_NOTIFICATION_SENT_SUCCESS,
    });
  };

  sendAllNotification = async (req: AuthRequest, res: Response): Promise<void> => {
    const data: AllNotificationDTO = req.body;
    const senderId = req.user?.userId;

    if (!senderId) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);
    }

    await this.allNotificationUseCase.execute(data, senderId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.ALL_NOTIFICATION_SENT_SUCCESS,
    });
  };

  getNotificationHistory = async (req: AuthRequest, res: Response): Promise<void> => {
    const senderId = req.user?.userId;
    if (!senderId) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);
    }

    const notifications = await this.notificationHistoryUseCase.execute(senderId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.NOTIFICATION_HISTORY_FETCH_SUCCESS,
      data: notifications,
    });
  };
}
