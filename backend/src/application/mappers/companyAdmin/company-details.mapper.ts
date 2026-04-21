import { CompanyEntity } from '../../../domain/entities/company.entity';
import { SubscriptionPlanEntity } from '../../../domain/entities/admin/subscription-plan.entity';
import { CompanyDetailsDTO } from '../../DTOs/companyAdmin/company-details.dto';

export class CompanyDetailsMapper {
  static toDTO(company: CompanyEntity, subscription: SubscriptionPlanEntity): CompanyDetailsDTO {
    return {
      company: {
        _id: company._id ?? '',
        companyName: company.companyName ?? '',
        email: company.email ?? '',
        address: company.address ?? '',
        number: company.number ?? '',
        OwnerId: company.OwnerId ?? '',
        planId: company.planId ?? '',
        status: company.status ?? 'pending',
        rejectionReason: company.rejectionReason,
        startDate: company.startDate,
        endDate: company.endDate,
      },
      subscription: {
        id: subscription.getId() ?? '',
        name: subscription.getName(),
        price: subscription.getPrice(),
        duration: subscription.getDuration(),
        features: subscription.getFeatures(),
        type: subscription.getType(),
        userLimit: subscription.getUserLimit(),
      },
    };
  }
}
