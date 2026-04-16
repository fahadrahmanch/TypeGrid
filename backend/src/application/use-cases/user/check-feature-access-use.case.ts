import { ISubscriptionPlanRepository } from "../../../domain/interfaces/repository/admin/subscription-plan.repository.interface";
import { IUserSubscriptionRepository } from "../../../domain/interfaces/repository/user/user-subscription.repository.interface";
import { ICheckFeatureAccessUseCase } from "../interfaces/user/check-feature-access.interface";

export class CheckFeatureAccessUseCase implements ICheckFeatureAccessUseCase {
  constructor(
    private readonly _subscriptionRepo: IUserSubscriptionRepository,
    private readonly _planRepo: ISubscriptionPlanRepository
  ) {}

  async execute(userId: string, feature: string): Promise<boolean> {
      const sub = await this._subscriptionRepo.findActive(userId);

      if (!sub) {
        throw new Error("Active subscription required for this feature");
      }

      const plan = await this._planRepo.findById(sub.getSubscriptionPlanId());

      if (!plan) {
        throw new Error("Subscription plan details not found");
      }

      console.log("plan", plan);
      console.log("feature", feature);

      if (!plan.getFeatures().includes(feature)) {
        throw new Error(`Your current plan does not include the '${feature}' feature`);
      }

      return true;
   
  }
}