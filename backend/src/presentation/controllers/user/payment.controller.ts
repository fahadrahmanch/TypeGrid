import { NextFunction, Response, Request } from "express";
import { AuthRequest } from "../../../types/AuthRequest";
import { ICreateSubscriptionSessionUseCase } from "../../../application/use-cases/interfaces/user/subsciption/create-subscription-session.interface";
import { IConfirmSubscriptionUseCase } from "../../../application/use-cases/interfaces/user/subsciption/confirm-subscription.interface";
import { IConfirmCompanySubscriptionUseCase } from "../../../application/use-cases/interfaces/admin/confirm-company-subscription.interface";

export class PaymentController {
    constructor(
        private _createSubscriptionSessionUseCase: ICreateSubscriptionSessionUseCase,
        private _confirmSubscriptionUseCase: IConfirmSubscriptionUseCase,
        private _confirmCompanySubscriptionUseCase: IConfirmCompanySubscriptionUseCase
    ) { }

    async createSession(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { planId } = req.body;
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({ success: false, message: "User not authenticated" });
                return;
            }

            if (!planId) {
                res.status(400).json({ success: false, message: "planId is required" });
                return;
            }

            const url = await this._createSubscriptionSessionUseCase.execute(userId, planId);
            res.status(200).json({
                success: true,
                message: "Checkout session created successfully",
                url
            });
        } catch (error: unknown) {
            next(error);
        }
    }

    async createCompanySession(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { planId } = req.body;
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({ success: false, message: "User not authenticated" });
                return;
            }

            if (!planId) {
                res.status(400).json({ success: false, message: "planId is required" });
                return;
            }

            const url = await this._createSubscriptionSessionUseCase.execute(userId, planId);
            res.status(200).json({
                success: true,
                message: "Checkout session created successfully",
                url
            });
        } catch (error: unknown) {
            next(error);
        }
    }

    async confirmSubscription(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { planId } = req.body;
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({ success: false, message: "User not authenticated" });
                return;
            }

            if (!planId) {
                res.status(400).json({ success: false, message: "planId is required" });
                return;
            }

            await this._confirmCompanySubscriptionUseCase.execute(userId, planId);

            res.status(200).json({
                success: true,
                message: "Subscription confirmed successfully"
            });
        } catch (error: unknown) {
            next(error);
        }
    }
    async confirmCompanySubscription(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { planId } = req.body;
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({ success: false, message: "User not authenticated" });
                return;
            }

            if (!planId) {
                res.status(400).json({ success: false, message: "planId is required" });
                return;
            }

            await this._confirmSubscriptionUseCase.execute(userId, planId);

            res.status(200).json({
                success: true,
                message: "Subscription confirmed successfully"
            });
        } catch (error: unknown) {
            next(error);
        }
    }
}
