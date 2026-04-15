import { SubscriptionPlanResponseDTO } from "../../DTOs/admin/subscription-plan.dto";

export function mapToSubscriptionPlan(plan: any): SubscriptionPlanResponseDTO {
  return {
    id: plan.id || plan._id?.toString() || "",
    name: plan.name,
    price: Number(plan.price),
    duration: Number(plan.duration),
    features: plan.features || [],
    type: plan.type,
    userLimit: plan.userLimit ? Number(plan.userLimit) : undefined,
    createdAt: plan.createdAt,
    updatedAt: plan.updatedAt,
  };
}
