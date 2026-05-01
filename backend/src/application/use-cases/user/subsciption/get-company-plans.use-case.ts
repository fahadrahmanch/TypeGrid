import { IGetCompanyPlansUseCase } from "../../interfaces/user/subsciption/get-company-plans.interface";
import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/repository/admin/subscription-plan.repository.interface";
import { SubscriptionPlanDTO } from "../../../DTOs/user/subscription-plan.dto";
import { subscriptionPlanMapper } from "../../../mappers/user/subscription-plan.mapper";

export class GetCompanyPlansUseCase implements IGetCompanyPlansUseCase {
  constructor(private readonly _subscriptionRepository: ISubscriptionPlanRepository) {}

  async execute(): Promise<SubscriptionPlanDTO[]> {
    try {
      const plans = await this._subscriptionRepository.find({
        type: "company",
      });
      return plans.map((plan) => subscriptionPlanMapper(plan));
    } catch (error: unknown) {
      throw error;
    }
  }
}
