import { Response } from 'express';
import { AuthRequest } from '../../../types/AuthRequest';
import { ICreateSubscriptionSessionUseCase } from '../../../application/use-cases/interfaces/user/subsciption/create-subscription-session.interface';
import { IConfirmSubscriptionUseCase } from '../../../application/use-cases/interfaces/user/subsciption/confirm-subscription.interface';
import { IConfirmCompanySubscriptionUseCase } from '../../../application/use-cases/interfaces/admin/confirm-company-subscription.interface';
import { HttpStatus } from '../../constants/httpStatus';
import { MESSAGES } from '../../../domain/constants/messages';
import { CustomError } from '../../../domain/entities/custom-error.entity';

export class PaymentController {
  constructor(
    private _createSubscriptionSessionUseCase: ICreateSubscriptionSessionUseCase,
    private _confirmSubscriptionUseCase: IConfirmSubscriptionUseCase,
    private _confirmCompanySubscriptionUseCase: IConfirmCompanySubscriptionUseCase
  ) {}

  createSession = async (req: AuthRequest, res: Response): Promise<void> => {
    const { planId } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, MESSAGES.USER_NOT_AUTHENTICATED);
    }

    if (!planId) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.PLAN_ID_REQUIRED);
    }

    const url = await this._createSubscriptionSessionUseCase.execute(userId, planId);
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.CHECKOUT_SESSION_CREATED_SUCCESS,
      url,
    });
  };

  createCompanySession = async (req: AuthRequest, res: Response): Promise<void> => {
    const { planId } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, MESSAGES.USER_NOT_AUTHENTICATED);
    }

    if (!planId) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.PLAN_ID_REQUIRED);
    }

    const url = await this._createSubscriptionSessionUseCase.execute(userId, planId);
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.CHECKOUT_SESSION_CREATED_SUCCESS,
      url,
    });
  };

  confirmSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
    const { planId } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, MESSAGES.USER_NOT_AUTHENTICATED);
    }

    if (!planId) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.PLAN_ID_REQUIRED);
    }

    await this._confirmCompanySubscriptionUseCase.execute(userId, planId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.SUBSCRIPTION_CONFIRMED_SUCCESS,
    });
  };
  confirmCompanySubscription = async (req: AuthRequest, res: Response): Promise<void> => {
    const { planId } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, MESSAGES.USER_NOT_AUTHENTICATED);
    }

    if (!planId) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.PLAN_ID_REQUIRED);
    }

    await this._confirmSubscriptionUseCase.execute(userId, planId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.SUBSCRIPTION_CONFIRMED_SUCCESS,
    });
  };
}
