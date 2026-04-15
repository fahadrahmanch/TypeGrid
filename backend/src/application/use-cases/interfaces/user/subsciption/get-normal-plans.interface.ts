import { SubscriptionPlanDTO } from "../../../../DTOs/user/subscription-plan.dto";

export interface IGetNormalPlansUseCase {
    execute(): Promise<SubscriptionPlanDTO[]>;
}