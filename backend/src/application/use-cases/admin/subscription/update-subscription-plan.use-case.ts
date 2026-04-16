import { UpdateSubscriptionPlanDTO, SubscriptionPlanResponseDTO } from "../../../DTOs/admin/subscription-plan.dto";
import { IUpdateSubscriptionPlanUseCase } from "../../interfaces/admin/update-subscription-plan.interface";
import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/repository/admin/subscription-plan.repository.interface";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { MESSAGES } from "../../../../domain/constants/messages";
import { subscriptionPlanToResponseDTO } from "../../../mappers/admin/subscription-plan.mapper";

export class UpdateSubscriptionPlanUseCase implements IUpdateSubscriptionPlanUseCase {
  constructor(private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository) {}

  async execute(data: UpdateSubscriptionPlanDTO): Promise<SubscriptionPlanResponseDTO> {
    const { id, ...updateData } = data;
    
    const isPlanExist = await this._subscriptionPlanRepository.findById(id);

    if (!isPlanExist) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.SUBSCRIPTION_PLAN_NOT_FOUND || "Subscription plan not found",
      );
    }

    const processedData: any = { ...updateData };
    if (updateData.price !== undefined) {
      processedData.price = Number(updateData.price);
    }
    if (updateData.duration !== undefined) {
      processedData.duration = updateData.duration === "monthly" ? 30 : 365;
    }
    if (updateData.userLimit !== undefined) {
      processedData.userLimit = Number(updateData.userLimit);
    }

    const updatedPlan = await this._subscriptionPlanRepository.updateById(id, processedData);
    
    if (!updatedPlan) {
      throw new CustomError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to update subscription plan"
      );
    }

    return subscriptionPlanToResponseDTO(updatedPlan.toObject ? updatedPlan.toObject() : updatedPlan);
  }
}
