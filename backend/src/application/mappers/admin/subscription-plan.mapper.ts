import { SubscriptionPlanResponseDTO } from "../../DTOs/admin/subscription-plan.dto";
import { SubscriptionPlanEntity } from "../../../domain/entities/admin/subscription-plan.entity";

export function subscriptionPlanToResponseDTO(plan: SubscriptionPlanEntity | any): SubscriptionPlanResponseDTO {
  const data = plan instanceof SubscriptionPlanEntity ? plan.toObject() : plan;
  return {
    id: data.id || data._id?.toString() || "",
    name: data.name,
    price: Number(data.price),
    duration: Number(data.duration),
    features: data.features || [],
    type: data.type,
    userLimit: data.userLimit ? Number(data.userLimit) : undefined,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}
