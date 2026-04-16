import { NextFunction, Request, Response } from "express";
import { ICreateSubscriptionPlanUseCase } from "../../../application/use-cases/interfaces/admin/create-subscription-plan.interface";
import { IFetchNormalSubscriptionPlansUseCase } from "../../../application/use-cases/interfaces/admin/fetch-normal-subscription-plans.interface";
import { IFetchCompanySubscriptionPlansUseCase } from "../../../application/use-cases/interfaces/admin/fetch-company-subscription-plans.interface";
import { IUpdateSubscriptionPlanUseCase } from "../../../application/use-cases/interfaces/admin/update-subscription-plan.interface";
import { IDeleteSubscriptionPlanUseCase } from "../../../application/use-cases/interfaces/admin/delete-subscription-plan.interface";
import { HttpStatus } from "../../constants/httpStatus";
import logger from "../../../utils/logger";

export class SubscriptionController {
  constructor(
    private readonly _createSubscriptionPlanUseCase: ICreateSubscriptionPlanUseCase,
    private readonly _fetchNormalSubscriptionPlansUseCase: IFetchNormalSubscriptionPlansUseCase,
    private readonly _fetchCompanySubscriptionPlansUseCase: IFetchCompanySubscriptionPlansUseCase,
    private readonly _updateSubscriptionPlanUseCase: IUpdateSubscriptionPlanUseCase,
    private readonly _deleteSubscriptionPlanUseCase: IDeleteSubscriptionPlanUseCase,
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
  async fetchNormalSubscriptionPlans(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log("hy")
      const subscriptionPlans = await this._fetchNormalSubscriptionPlansUseCase.execute();
     console.log("subscriptionPlans normal",subscriptionPlans)
      logger.info("Normal subscription plans fetched successfully", subscriptionPlans);
      res.status(HttpStatus.OK).json({
        message: "Normal subscription plans fetched successfully",
        subscriptionPlans,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
  async fetchCompanySubscriptionPlans(
    req: Request,
    res: Response,
    next: NextFunction
  ):Promise<void>{
    try {
      const subscriptionPlans = await this._fetchCompanySubscriptionPlansUseCase.execute();
      console.log("subscriptionPlans company",subscriptionPlans)
      logger.info("Company subscription plans fetched successfully", subscriptionPlans);
      res.status(HttpStatus.OK).json({
        message: "Company subscription plans fetched successfully",
        subscriptionPlans,
      });
    } catch (error: unknown) {
      next(error);
    }
  } 

  async updateSubscriptionPlan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const subscriptionPlan = await this._updateSubscriptionPlanUseCase.execute({
        id,
        ...req.body,
      });
      logger.info("Subscription plan updated successfully", subscriptionPlan);
      res.status(HttpStatus.OK).json({
        message: "Subscription plan updated successfully",
        subscriptionPlan,
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async deleteSubscriptionPlan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      await this._deleteSubscriptionPlanUseCase.execute(id);
      logger.info("Subscription plan deleted successfully", { id });
      res.status(HttpStatus.OK).json({
        message: "Subscription plan deleted successfully",
      });
    } catch (error: unknown) {
      next(error);
    }
  }
  
}