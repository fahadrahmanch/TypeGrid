import { SubscriptionPlanResponseDTO } from '../../../DTOs/admin/subscription-plan.dto';

export interface IFetchCompanySubscriptionPlansUseCase {
  execute(): Promise<SubscriptionPlanResponseDTO[]>;
}
