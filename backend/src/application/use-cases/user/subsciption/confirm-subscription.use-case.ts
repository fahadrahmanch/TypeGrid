import { IConfirmSubscriptionUseCase } from "../../interfaces/user/subsciption/confirm-subscription.interface";
import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/repository/admin/subscription-plan.repository.interface";
import { IUserSubscriptionRepository } from "../../../../domain/interfaces/repository/user/user-subscription.repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { UserSubscriptionEntity } from "../../../../domain/entities/user/user-subscription.entity";

export class ConfirmSubscriptionUseCase implements IConfirmSubscriptionUseCase {
    constructor(
        private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
        private readonly _userSubscriptionRepository: IUserSubscriptionRepository,
        private readonly _userRepository: IUserRepository,
    ) {}

    async execute(userId: string, planId: string): Promise<void> {
        try {
            const plan = await this._subscriptionPlanRepository.findById(planId);
            if (!plan) {
                throw new Error("Subscription plan not found");
            }

            const startDate = new Date();
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + plan.getDuration());

            const userSubscription = new UserSubscriptionEntity({
                userId,
                subscriptionPlanId: planId,
                status: "active",
                startDate,
                endDate,
            });

            await this._userSubscriptionRepository.create(userSubscription.toObject());

            
            
        } catch (error: unknown) {
            throw error;
        }
    }
}
