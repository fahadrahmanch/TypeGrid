import { IDeleteSubscriptionPlanUseCase } from "../../interfaces/admin/delete-subscription-plan.interface";
import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/repository/admin/subscription-plan.repository.interface";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { MESSAGES } from "../../../../domain/constants/messages";

export class DeleteSubscriptionPlanUseCase implements IDeleteSubscriptionPlanUseCase {
  constructor(private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository) {}

  async execute(id: string): Promise<void> {
    const isPlanExist = await this._subscriptionPlanRepository.findById(id);

    if (!isPlanExist) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.SUBSCRIPTION_PLAN_NOT_FOUND || "Subscription plan not found",
      );
    }

    await this._subscriptionPlanRepository.delete(id);
  }
}
