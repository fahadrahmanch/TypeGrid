import { ISubscriptionPlanDocument } from "../../types/documents";
import { SubscriptionPlanEntity } from "../../../../domain/entities/admin/subscription-plan.entity";

export class SubscriptionPlanMapper {
  static toDomain(doc: ISubscriptionPlanDocument): SubscriptionPlanEntity {
    return new SubscriptionPlanEntity({
      id: doc._id?.toString(),
      name: doc.name,
      price: doc.price,
      duration: doc.duration,
      features: doc.features,
      type: doc.type,
      userLimit: doc.userLimit,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
