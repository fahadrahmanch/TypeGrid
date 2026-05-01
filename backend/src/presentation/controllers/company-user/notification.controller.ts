import { Response } from "express";
import { AuthRequest } from "../../../types/AuthRequest";
import { IGetNotificationsUseCase } from "../../../application/use-cases/interfaces/companyUser/get-notifications.interface";
import { IMarkNotificationAsReadUseCase } from "../../../application/use-cases/interfaces/companyUser/mark-notification-as-read.interface";
import { HttpStatus } from "../../constants/httpStatus";
import { MESSAGES } from "../../../domain/constants/messages";
import { CustomError } from "../../../domain/entities/custom-error.entity";

export class NotificationController {
  constructor(
    private readonly getNotificationsUseCase: IGetNotificationsUseCase,
    private readonly markNotificationAsReadUseCase: IMarkNotificationAsReadUseCase
  ) {}

  getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, MESSAGES.UNAUTHORIZED_PORTAL_ACCESS || "Unauthorized");
    }

    const notifications = await this.getNotificationsUseCase.execute(userId);
    res.status(HttpStatus.OK).json({
      success: true,
      data: notifications,
    });
  };

  markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.NOTIFICATION_ID_REQUIRED || "Notification ID is required");
    }

    await this.markNotificationAsReadUseCase.execute(id);

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.NOTIFICATION_MARKED_READ,
    });
  };
}
