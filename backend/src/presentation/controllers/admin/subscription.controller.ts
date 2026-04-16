import { Request, Response } from 'express';
import { ICreateSubscriptionPlanUseCase } from '../../../application/use-cases/interfaces/admin/create-subscription-plan.interface';
import { IFetchNormalSubscriptionPlansUseCase } from '../../../application/use-cases/interfaces/admin/fetch-normal-subscription-plans.interface';
import { IFetchCompanySubscriptionPlansUseCase } from '../../../application/use-cases/interfaces/admin/fetch-company-subscription-plans.interface';
import { IUpdateSubscriptionPlanUseCase } from '../../../application/use-cases/interfaces/admin/update-subscription-plan.interface';
import { IDeleteSubscriptionPlanUseCase } from '../../../application/use-cases/interfaces/admin/delete-subscription-plan.interface';
import { HttpStatus } from '../../constants/httpStatus';
import { MESSAGES } from '../../../domain/constants/messages';
import logger from '../../../utils/logger';

export class SubscriptionController {
  constructor(
    private readonly _createSubscriptionPlanUseCase: ICreateSubscriptionPlanUseCase,
    private readonly _fetchNormalSubscriptionPlansUseCase: IFetchNormalSubscriptionPlansUseCase,
    private readonly _fetchCompanySubscriptionPlansUseCase: IFetchCompanySubscriptionPlansUseCase,
    private readonly _updateSubscriptionPlanUseCase: IUpdateSubscriptionPlanUseCase,
    private readonly _deleteSubscriptionPlanUseCase: IDeleteSubscriptionPlanUseCase
  ) {}

  createSubscriptionPlan = async (req: Request, res: Response): Promise<void> => {
    const subscriptionPlan = await this._createSubscriptionPlanUseCase.execute(req.body);
    logger.info(MESSAGES.SUBSCRIPTION_PLAN_CREATED_SUCCESS, subscriptionPlan);
    res.status(HttpStatus.CREATED).json({
      message: MESSAGES.SUBSCRIPTION_PLAN_CREATED_SUCCESS,
      subscriptionPlan,
    });
  };
  fetchNormalSubscriptionPlans = async (req: Request, res: Response): Promise<void> => {
    const subscriptionPlans = await this._fetchNormalSubscriptionPlansUseCase.execute();
    logger.info(MESSAGES.NORMAL_SUBSCRIPTION_PLANS_FETCH_SUCCESS, subscriptionPlans);
    res.status(HttpStatus.OK).json({
      message: MESSAGES.NORMAL_SUBSCRIPTION_PLANS_FETCH_SUCCESS,
      subscriptionPlans,
    });
  };
  fetchCompanySubscriptionPlans = async (req: Request, res: Response): Promise<void> => {
    const subscriptionPlans = await this._fetchCompanySubscriptionPlansUseCase.execute();
    logger.info(MESSAGES.COMPANY_SUBSCRIPTION_PLANS_FETCH_SUCCESS, subscriptionPlans);
    res.status(HttpStatus.OK).json({
      message: MESSAGES.COMPANY_SUBSCRIPTION_PLANS_FETCH_SUCCESS,
      subscriptionPlans,
    });
  };

  updateSubscriptionPlan = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const subscriptionPlan = await this._updateSubscriptionPlanUseCase.execute({
      id,
      ...req.body,
    });
    logger.info(MESSAGES.SUBSCRIPTION_PLAN_UPDATED_SUCCESS, subscriptionPlan);
    res.status(HttpStatus.OK).json({
      message: MESSAGES.SUBSCRIPTION_PLAN_UPDATED_SUCCESS,
      subscriptionPlan,
    });
  };

  deleteSubscriptionPlan = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this._deleteSubscriptionPlanUseCase.execute(id);
    logger.info(MESSAGES.SUBSCRIPTION_PLAN_DELETED_SUCCESS, { id });
    res.status(HttpStatus.OK).json({
      message: MESSAGES.SUBSCRIPTION_PLAN_DELETED_SUCCESS,
    });
  };
}
