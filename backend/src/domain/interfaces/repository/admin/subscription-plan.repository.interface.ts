import { IBaseRepository } from '../base-repository.interface';
import { SubscriptionPlanEntity } from '../../../entities/admin/subscription-plan.entity';

export interface ISubscriptionPlanRepository extends IBaseRepository<SubscriptionPlanEntity> {}
