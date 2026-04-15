import { NextFunction, Response, Request } from "express";
import { AuthRequest } from "../../../types/AuthRequest";
import { IGetNormalPlansUseCase } from "../../../application/use-cases/interfaces/user/subsciption/get-normal-plans.interface";
import { IGetCompanyPlansUseCase } from "../../../application/use-cases/interfaces/user/subsciption/get-company-plans.interface";

export class SubscriptionController {
    constructor(
        private _getNormalPlansUseCase: IGetNormalPlansUseCase,
        private _getCompanyPlansUseCase: IGetCompanyPlansUseCase,
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
}