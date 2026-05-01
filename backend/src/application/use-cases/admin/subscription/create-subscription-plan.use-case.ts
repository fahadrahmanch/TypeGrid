import { CreateSubscriptionPlanDTO, SubscriptionPlanResponseDTO } from "../../../DTOs/admin/subscription-plan.dto";
import { ICreateSubscriptionPlanUseCase } from "../../interfaces/admin/create-subscription-plan.interface";
import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/repository/admin/subscription-plan.repository.interface";
import { SubscriptionPlanEntity } from "../../../../domain/entities/admin/subscription-plan.entity";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { MESSAGES } from "../../../../domain/constants/messages";
import { subscriptionPlanToResponseDTO } from "../../../mappers/admin/subscription-plan.mapper";

export class CreateSubscriptionPlanUseCase implements ICreateSubscriptionPlanUseCase {
  constructor(private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository) {}

  async execute(data: CreateSubscriptionPlanDTO): Promise<SubscriptionPlanResponseDTO> {
    const isPlanExist = await this._subscriptionPlanRepository.findOne({
      name: data.name,
    });

    if (isPlanExist) {
      throw new CustomError(HttpStatusCodes.CONFLICT, MESSAGES.SUBSCRIPTION_PLAN_ALREADY_EXISTS);
    }
    const processedData = {
      ...data,
      price: Number(data.price),
      duration: data.duration == "monthly" ? 30 : 365,
      userLimit: data.userLimit ? Number(data.userLimit) : undefined,
      features: data.features || [],
    };

    const subscriptionPlanEntity = new SubscriptionPlanEntity(processedData);

    const newPlan = (await this._subscriptionPlanRepository.create(subscriptionPlanEntity.toObject())).toObject();
    return subscriptionPlanToResponseDTO(newPlan);
  }
}
