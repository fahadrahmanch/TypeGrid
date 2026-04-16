import { NextFunction, Response, Request } from "express";
import { AuthRequest } from "../../../types/AuthRequest";
import { IGetNormalPlansUseCase } from "../../../application/use-cases/interfaces/user/subsciption/get-normal-plans.interface";
import { IGetCompanyPlansUseCase } from "../../../application/use-cases/interfaces/user/subsciption/get-company-plans.interface";
import { IGetSubscriptionDetailsUseCase } from "../../../application/use-cases/interfaces/user/subsciption/get-subscription-details.interface";

export class SubscriptionController {
    constructor(
        private _getNormalPlansUseCase: IGetNormalPlansUseCase,
        private _getCompanyPlansUseCase: IGetCompanyPlansUseCase,
        private _getSubscriptionDetailsUseCase: IGetSubscriptionDetailsUseCase,
    ) { }

    async getNormalSubscriptionPlans(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const plans = await this._getNormalPlansUseCase.execute();

            res.status(200).json({
                success: true,
                message: "Normal subscription plans fetched successfully",
                plans
            });
        } catch (error: unknown) {
            next(error);
        }
    }

    async getCompanySubscriptionPlans(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const plans = await this._getCompanyPlansUseCase.execute();
            res.status(200).json({
                success: true,
                message: "Company subscription plans fetched successfully",
                plans
            });
        } catch (error: unknown) {
            next(error);
        }
    }

    async getSubscriptionDetails(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log("req.user",req.user)
            const subscriptionDetails = await this._getSubscriptionDetailsUseCase.execute(req.user?.userId!);
            console.log("subscriptionDetails",subscriptionDetails)
            res.status(200).json({
                success: true,
                message: "Subscription details fetched successfully",
                subscriptionDetails
            });
        } catch (error: unknown) {
            next(error);
        }
    }
}