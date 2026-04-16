import { ISubscriptionPlanRepository } from '../../../../domain/interfaces/repository/admin/subscription-plan.repository.interface';
import { SubscriptionPlanResponseDTO } from '../../../DTOs/admin/subscription-plan.dto';
import { IFetchCompanySubscriptionPlansUseCase } from '../../interfaces/admin/fetch-company-subscription-plans.interface';
import { subscriptionPlanToResponseDTO } from '../../../mappers/admin/subscription-plan.mapper';

export class FetchCompanySubscriptionPlansUseCase implements IFetchCompanySubscriptionPlansUseCase {
  constructor(private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository) {}

  async execute(): Promise<SubscriptionPlanResponseDTO[]> {
    const subscriptionPlans = await this._subscriptionPlanRepository.find({
      type: 'company',
    });
    return subscriptionPlans.map((plan) => subscriptionPlanToResponseDTO(plan));
  }
}
