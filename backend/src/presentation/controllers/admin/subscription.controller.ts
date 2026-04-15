import { NextFunction, Request, Response } from "express";
import { ICreateSubscriptionPlanUseCase } from "../../../application/use-cases/interfaces/admin/create-subscription-plan.interface";
import { HttpStatus } from "../../constants/httpStatus";
import logger from "../../../utils/logger";

export class SubscriptionController {
  constructor(
    private readonly _createSubscriptionPlanUseCase: ICreateSubscriptionPlanUseCase
  ) {}

  async createSubscriptionPlan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const subscriptionPlan = await this._createSubscriptionPlanUseCase.execute(req.body);
      logger.info("Subscription plan created successfully", subscriptionPlan);
      res.status(HttpStatus.CREATED).json({
        message: "Subscription plan created successfully",
        subscriptionPlan,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
}