import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../../types/AuthRequest";
import { IIndividualNotificationUseCase } from "../../../application/use-cases/interfaces/companyAdmin/individual-notification.interface";
import { IGroupNotificationUseCase } from "../../../application/use-cases/interfaces/companyAdmin/group-notification.interface";
import { IAllNotificationUseCase } from "../../../application/use-cases/interfaces/companyAdmin/all-notification.interface";
import { INotificationHistoryUseCase } from "../../../application/use-cases/interfaces/companyAdmin/notification-history.interface";
import { IndividualNotificationDTO, GroupNotificationDTO, AllNotificationDTO } from "../../../application/DTOs/companyAdmin/notification.dto";

export class NotificationController {
    constructor(
        private individualNotificationUseCase: IIndividualNotificationUseCase,
        private groupNotificationUseCase: IGroupNotificationUseCase,
        private allNotificationUseCase: IAllNotificationUseCase,
        private notificationHistoryUseCase: INotificationHistoryUseCase
    ) { }

    async sendIndividualNotification(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const data: IndividualNotificationDTO = req.body;
            const senderId = req.user?.userId;

            if (!senderId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            await this.individualNotificationUseCase.execute(data, senderId);

            res.status(200).json({
                success: true,
                message: "Notification sent successfully"
            });
        }
        catch (error: unknown) {
            next(error)
        }
    }

    async sendGroupNotification(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const data: GroupNotificationDTO = req.body;
            const senderId = req.user?.userId;

            if (!senderId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            await this.groupNotificationUseCase.execute(data, senderId);

            res.status(200).json({
                success: true,
                message: "Group notification sent successfully"
            });
        }
        catch (error: unknown) {
            next(error)
        }
    }

    async sendAllNotification(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const data: AllNotificationDTO = req.body;
            const senderId = req.user?.userId;

            if (!senderId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            await this.allNotificationUseCase.execute(data, senderId);

            res.status(200).json({
                success: true,
                message: "Notification sent to all users successfully"
            });
        }
        catch (error: unknown) {
            next(error)
        }
    }

    async getNotificationHistory(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const senderId = req.user?.userId;
            if (!senderId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const notifications = await this.notificationHistoryUseCase.execute(senderId);

            res.status(200).json({
                success: true,
                message: "Notification history fetched successfully",
                data: notifications
            });
        } catch (error: unknown) {
            next(error)
        }
    }

    
}