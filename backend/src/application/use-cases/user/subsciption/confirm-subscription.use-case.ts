import { IConfirmSubscriptionUseCase } from '../../interfaces/user/subsciption/confirm-subscription.interface';
import { ISubscriptionPlanRepository } from '../../../../domain/interfaces/repository/admin/subscription-plan.repository.interface';
import { IUserSubscriptionRepository } from '../../../../domain/interfaces/repository/user/user-subscription.repository.interface';
import { IUserRepository } from '../../../../domain/interfaces/repository/user/user-repository.interface';
import { UserSubscriptionEntity } from '../../../../domain/entities/user/user-subscription.entity';
import { CustomError } from '../../../../domain/entities/custom-error.entity';
import { HttpStatusCodes } from '../../../../domain/enums/http-status-codes.enum';
import { MESSAGES } from '../../../../domain/constants/messages';

export class ConfirmSubscriptionUseCase implements IConfirmSubscriptionUseCase {
  constructor(
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
    private readonly _userSubscriptionRepository: IUserSubscriptionRepository,
    private readonly _userRepository: IUserRepository
  ) {}

  async execute(userId: string, planId: string): Promise<void> {
    console.log('userId', userId);
    console.log('planId', planId);
    const plan = await this._subscriptionPlanRepository.findById(planId);
    if (!plan) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.SUBSCRIPTION_PLAN_NOT_FOUND);
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.getDuration());

    const existingActiveSub = await this._userSubscriptionRepository.findOne({
      userId,
      status: 'active',
    });

    if (existingActiveSub) {
      const subId = existingActiveSub.getId();
      if (subId) {
        await this._userSubscriptionRepository.updateById(subId, {
          subscriptionPlanId: planId,
          startDate,
          endDate,
          status: 'active',
        });
        return;
      }
    }

    const userSubscription = new UserSubscriptionEntity({
      userId,
      subscriptionPlanId: planId,
      status: 'active',
      startDate,
      endDate,
    });

    await this._userSubscriptionRepository.create(userSubscription.toObject());
  }
}
