import { ISubscriptionPlanRepository } from "../../../domain/interfaces/repository/admin/subscription-plan.repository.interface";
import { IUserSubscriptionRepository } from "../../../domain/interfaces/repository/user/user-subscription.repository.interface";
import { ICheckFeatureAccessUseCase } from "../interfaces/user/check-feature-access.interface";
import { CustomError } from "../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../domain/enums/http-status-codes.enum";
import { MESSAGES } from "../../../domain/constants/messages";

export class CheckFeatureAccessUseCase implements ICheckFeatureAccessUseCase {
  constructor(
    private readonly _subscriptionRepo: IUserSubscriptionRepository,
    private readonly _planRepo: ISubscriptionPlanRepository
  ) {}

  async execute(userId: string, feature: string): Promise<boolean> {
    const sub = await this._subscriptionRepo.findActive(userId);
    if (!sub) {
      throw new CustomError(HttpStatusCodes.BAD_REQUEST, MESSAGES.ACTIVE_SUBSCRIPTION_REQUIRED);
    }

    const plan = await this._planRepo.findById(sub.getSubscriptionPlanId());

    if (!plan) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.SUBSCRIPTION_PLAN_NOT_FOUND);
    }

    if (!plan.getFeatures().includes(feature)) {
      throw new CustomError(HttpStatusCodes.FORBIDDEN, MESSAGES.FEATURE_NOT_IN_PLAN);
    }

    return true;
  }
}
