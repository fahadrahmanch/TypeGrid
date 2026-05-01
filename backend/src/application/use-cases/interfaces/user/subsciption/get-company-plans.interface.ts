import { SubscriptionPlanDTO } from "../../../../DTOs/user/subscription-plan.dto";

export interface IGetCompanyPlansUseCase {
  execute(): Promise<SubscriptionPlanDTO[]>;
}
