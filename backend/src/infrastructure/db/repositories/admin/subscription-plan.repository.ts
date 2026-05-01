import { Model } from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/repository/admin/subscription-plan.repository.interface";
import { ISubscriptionPlanDocument } from "../../types/documents";
import { SubscriptionPlanEntity } from "../../../../domain/entities/admin/subscription-plan.entity";
import { SubscriptionPlanMapper } from "../../mappers/admin/subscription-plan.mapper";

export class SubscriptionPlanRepository
  extends BaseRepository<ISubscriptionPlanDocument, SubscriptionPlanEntity>
  implements ISubscriptionPlanRepository
{
  constructor(model: Model<ISubscriptionPlanDocument>) {
    super(model, SubscriptionPlanMapper.toDomain);
  }
}
