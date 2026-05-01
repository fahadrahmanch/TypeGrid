import { IBaseRepository } from "../base-repository.interface";
import { UserSubscriptionEntity } from "../../../entities/user/user-subscription.entity";

export interface IUserSubscriptionRepository extends IBaseRepository<UserSubscriptionEntity> {
  findActive(userId: string): Promise<UserSubscriptionEntity | null>;
  findCompanyActive(userId: string): Promise<UserSubscriptionEntity | null>;
}
