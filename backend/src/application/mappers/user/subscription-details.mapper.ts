import { SubscriptionDetailsDTO, UserSubscriptionDetailsDTO } from '../../DTOs/user/subscription-details.dto';
import { UserSubscriptionEntity } from '../../../domain/entities/user/user-subscription.entity';
import { CompanyEntity } from '../../../domain/entities/company.entity';
import { SubscriptionPlanEntity } from '../../../domain/entities/admin/subscription-plan.entity';

export function toUserSubscriptionDTO(
  userSubscription: UserSubscriptionEntity | any,
  plan: SubscriptionPlanEntity | any
): UserSubscriptionDetailsDTO {
  const subData = userSubscription instanceof UserSubscriptionEntity ? userSubscription.toObject() : userSubscription;
  const planData = plan instanceof SubscriptionPlanEntity ? plan.toObject() : plan;

  return {
    planId: planData.id || planData._id?.toString() || '',
    planName: planData.name,
    status: subData.status,
    startDate: subData.startDate,
    endDate: subData.endDate,
    type: planData.type,
  };
}

export function toSubscriptionDetailsDTO(
  personalSub?: UserSubscriptionDetailsDTO,
  companySub?: {
    company: CompanyEntity | any;
    plan: SubscriptionPlanEntity | any;
  }
): SubscriptionDetailsDTO {
  const details: SubscriptionDetailsDTO = {};

  if (personalSub) {
    details.personalSubscription = personalSub;
  }

  if (companySub && companySub.company && companySub.plan) {
    const companyData = companySub.company;
    const planData = companySub.plan instanceof SubscriptionPlanEntity ? companySub.plan.toObject() : companySub.plan;

    details.companySubscription = {
      companyId: companyData.id || companyData._id?.toString() || '',
      companyName: companyData.companyName || '',
      subscription: {
        planId: planData.id || planData._id?.toString() || '',
        planName: planData.name || '',
        status: companyData.status === 'active' ? 'active' : 'inactive',
        type: 'company',
      },
    };
  }

  return details;
}
