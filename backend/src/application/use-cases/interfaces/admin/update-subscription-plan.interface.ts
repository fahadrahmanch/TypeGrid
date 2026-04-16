import { UpdateSubscriptionPlanDTO, SubscriptionPlanResponseDTO } from '../../../DTOs/admin/subscription-plan.dto';

export interface IUpdateSubscriptionPlanUseCase {
  execute(data: UpdateSubscriptionPlanDTO): Promise<SubscriptionPlanResponseDTO>;
}
