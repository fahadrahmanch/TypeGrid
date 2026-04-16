import { SubscriptionPlanEntity } from '../../../domain/entities/admin/subscription-plan.entity';
import { SubscriptionPlanDTO } from '../../DTOs/user/subscription-plan.dto';

export function subscriptionPlanMapper(entity: SubscriptionPlanEntity): SubscriptionPlanDTO {
  return {
    id: entity.getId() || '',
    name: entity.getName(),
    price: entity.getPrice(),
    duration: entity.getDuration(),
    features: entity.getFeatures(),
    type: entity.getType(),
    userLimit: entity.getUserLimit(),
  };
}
