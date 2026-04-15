import { Model } from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { IUserSubscriptionRepository } from "../../../../domain/interfaces/repository/user/user-subscription.repository.interface";
import { IUserSubscriptionDocument } from "../../types/documents";
import { UserSubscriptionEntity } from "../../../../domain/entities/user/user-subscription.entity";
import { UserSubscriptionMapper } from "../../mappers/user/user-subscription.mapper";

export class UserSubscriptionRepository
  extends BaseRepository<IUserSubscriptionDocument, UserSubscriptionEntity>
  implements IUserSubscriptionRepository
{
  constructor(model: Model<IUserSubscriptionDocument>) {
    super(model, UserSubscriptionMapper.toDomain);
  }
  async findActive(userId: string): Promise<UserSubscriptionEntity | null> {
    try {
      const doc = await this.model.findOne({
        userId,
        status: "active",
        endDate: { $gt: new Date() },
      });
      return doc ? this.toDomain(doc) : null;
    } catch (error: unknown) {
      throw error;
    }
  }
}
 