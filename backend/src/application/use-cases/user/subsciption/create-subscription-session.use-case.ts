import { ICreateSubscriptionSessionUseCase } from "../../interfaces/user/subsciption/create-subscription-session.interface";
import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/repository/admin/subscription-plan.repository.interface";
import { IStripeService } from "../../../../domain/interfaces/services/stripe-service.interface";

export class CreateSubscriptionSessionUseCase implements ICreateSubscriptionSessionUseCase {
    constructor(
        private readonly _subscriptionRepository: ISubscriptionPlanRepository,
        private readonly _stripeService: IStripeService,
    ) {}

    async execute(userId: string, planId: string): Promise<string> {
        try {
            const plan = await this._subscriptionRepository.findById(planId);
            if (!plan) {
                throw new Error("Plan not found");
            }
            
            const sessionUrl = await this._stripeService.createCheckoutSession(
                plan.getName(),
                plan.getPrice(),
                planId
            );

            if (!sessionUrl) {
                throw new Error("Failed to create checkout session");
            }

            return sessionUrl;
        } catch (error: unknown) {
            throw error;
        }
    }
}
