import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/repository/admin/subscription-plan.repository.interface";
import { SubscriptionPlanResponseDTO } from "../../../DTOs/admin/subscription-plan.dto";
import { IFetchNormalSubscriptionPlansUseCase } from "../../interfaces/admin/fetch-normal-subscription-plans.interface";
import { subscriptionPlanToResponseDTO } from "../../../mappers/admin/subscription-plan.mapper";
export class FetchNormalSubscriptionPlansUseCase implements IFetchNormalSubscriptionPlansUseCase {
  constructor(private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository) {}

  async execute(): Promise<SubscriptionPlanResponseDTO[]> {
    // Logic will be implemented later
    const subscriptionPlans = await this._subscriptionPlanRepository.find({type: "normal"});
    return subscriptionPlans.map((plan) => subscriptionPlanToResponseDTO(plan));
  }
}
