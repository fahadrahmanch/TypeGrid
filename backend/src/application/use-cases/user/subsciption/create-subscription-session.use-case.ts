import { ICreateSubscriptionSessionUseCase } from "../../interfaces/user/subsciption/create-subscription-session.interface";
import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/repository/admin/subscription-plan.repository.interface";
import { IStripeService } from "../../../../domain/interfaces/services/stripe-service.interface";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { MESSAGES } from "../../../../domain/constants/messages";

export class CreateSubscriptionSessionUseCase implements ICreateSubscriptionSessionUseCase {
  constructor(
    private readonly _subscriptionRepository: ISubscriptionPlanRepository,
    private readonly _stripeService: IStripeService
  ) {}

  async execute(userId: string, planId: string): Promise<string> {
    try {
      const plan = await this._subscriptionRepository.findById(planId);
      if (!plan) {
        throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.PLAN_NOT_FOUND);
      }

      const sessionUrl = await this._stripeService.createCheckoutSession(plan.getName(), plan.getPrice(), planId,plan.getType());

      if (!sessionUrl) {
        throw new CustomError(HttpStatusCodes.INTERNAL_SERVER_ERROR, MESSAGES.CHECKOUT_SESSION_CREATE_FAILED);
      }

      return sessionUrl;
    } catch (error: unknown) {
      throw error;
    }
  }
}
