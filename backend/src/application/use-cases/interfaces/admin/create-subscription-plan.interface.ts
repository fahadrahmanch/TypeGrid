import { CreateSubscriptionPlanDTO, SubscriptionPlanResponseDTO } from '../../../DTOs/admin/subscription-plan.dto';

export interface ICreateSubscriptionPlanUseCase {
  execute(data: CreateSubscriptionPlanDTO): Promise<SubscriptionPlanResponseDTO>;
}
