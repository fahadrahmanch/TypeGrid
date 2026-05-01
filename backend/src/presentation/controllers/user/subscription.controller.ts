import { Response } from "express";
import { AuthRequest } from "../../../types/AuthRequest";
import { IGetNormalPlansUseCase } from "../../../application/use-cases/interfaces/user/subsciption/get-normal-plans.interface";
import { IGetCompanyPlansUseCase } from "../../../application/use-cases/interfaces/user/subsciption/get-company-plans.interface";
import { IGetSubscriptionDetailsUseCase } from "../../../application/use-cases/interfaces/user/subsciption/get-subscription-details.interface";
import { HttpStatus } from "../../constants/httpStatus";
import { MESSAGES } from "../../../domain/constants/messages";

export class SubscriptionController {
  constructor(
    private _getNormalPlansUseCase: IGetNormalPlansUseCase,
    private _getCompanyPlansUseCase: IGetCompanyPlansUseCase,
    private _getSubscriptionDetailsUseCase: IGetSubscriptionDetailsUseCase
  ) {}

  getNormalSubscriptionPlans = async (req: AuthRequest, res: Response): Promise<void> => {
    const plans = await this._getNormalPlansUseCase.execute();

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.NORMAL_SUBSCRIPTION_PLANS_FETCH_SUCCESS,
      plans,
    });
  };

  getCompanySubscriptionPlans = async (req: AuthRequest, res: Response): Promise<void> => {
    const plans = await this._getCompanyPlansUseCase.execute();
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.COMPANY_SUBSCRIPTION_PLANS_FETCH_SUCCESS,
      plans,
    });
  };

  getSubscriptionDetails = async (req: AuthRequest, res: Response): Promise<void> => {
    const subscriptionDetails = await this._getSubscriptionDetailsUseCase.execute(req.user?.userId!);
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.SUBSCRIPTION_DETAILS_FETCH_SUCCESS,
      subscriptionDetails,
    });
  };
}
