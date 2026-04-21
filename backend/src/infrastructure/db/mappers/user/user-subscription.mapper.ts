import { IUserSubscriptionDocument } from '../../types/documents';
import { UserSubscriptionEntity } from '../../../../domain/entities/user/user-subscription.entity';

export class UserSubscriptionMapper {
  static toDomain(doc: IUserSubscriptionDocument): UserSubscriptionEntity {
    return new UserSubscriptionEntity({
      id: doc._id?.toString(),
      userId: doc.userId.toString(),
      subscriptionPlanId: doc.subscriptionPlanId.toString(),
      planType: doc.planType,
      status: doc.status,
      startDate: doc.startDate,
      endDate: doc.endDate,
      paymentId: doc.paymentId?.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
