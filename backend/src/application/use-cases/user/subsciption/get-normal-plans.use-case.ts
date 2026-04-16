import { IGetNormalPlansUseCase } from '../../interfaces/user/subsciption/get-normal-plans.interface';
import { ISubscriptionPlanRepository } from '../../../../domain/interfaces/repository/admin/subscription-plan.repository.interface';
import { SubscriptionPlanDTO } from '../../../DTOs/user/subscription-plan.dto';
import { subscriptionPlanMapper } from '../../../mappers/user/subscription-plan.mapper';

export class GetNormalPlansUseCase implements IGetNormalPlansUseCase {
  constructor(private readonly _subscriptionRepository: ISubscriptionPlanRepository) {}

  async execute(): Promise<SubscriptionPlanDTO[]> {
    try {
      const plans = await this._subscriptionRepository.find({
        type: 'normal',
      });
      return plans.map((plan) => subscriptionPlanMapper(plan));
    } catch (error: unknown) {
      throw error;
    }
  }
}
