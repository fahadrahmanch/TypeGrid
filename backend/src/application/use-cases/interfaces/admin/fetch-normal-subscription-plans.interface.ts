import { SubscriptionPlanResponseDTO } from '../../../DTOs/admin/subscription-plan.dto';

export interface IFetchNormalSubscriptionPlansUseCase {
  execute(): Promise<SubscriptionPlanResponseDTO[]>;
}
