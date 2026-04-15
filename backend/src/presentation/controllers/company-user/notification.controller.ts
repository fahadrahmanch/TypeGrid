import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../../types/AuthRequest";
import { IGetNotificationsUseCase } from "../../../application/use-cases/interfaces/companyUser/get-notifications.interface";
import { IMarkNotificationAsReadUseCase } from "../../../application/use-cases/interfaces/companyUser/mark-notification-as-read.interface";

export class NotificationController {
  constructor(
    private readonly getNotificationsUseCase: IGetNotificationsUseCase,
    private readonly markNotificationAsReadUseCase: IMarkNotificationAsReadUseCase
  ) {}

  async getNotifications(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const notifications = await this.getNotificationsUseCase.execute(userId);
      res.status(200).json({
        success: true,
        data: notifications,
      });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {

      const { id } = req.params;
      if (!id) {
         return res.status(400).json({ message: "Notification ID is required" });
      }

      await this.markNotificationAsReadUseCase.execute(id);

      res.status(200).json({
        success: true,
        message: "Notification marked as read",
      });
    } catch (error) {
      next(error);
    }
  }
}
