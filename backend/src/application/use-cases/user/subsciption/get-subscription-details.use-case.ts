import { IGetSubscriptionDetailsUseCase } from '../../interfaces/user/subsciption/get-subscription-details.interface';
import { SubscriptionDetailsDTO } from '../../../DTOs/user/subscription-details.dto';
import { IUserSubscriptionRepository } from '../../../../domain/interfaces/repository/user/user-subscription.repository.interface';
import { ICompanyRepository } from '../../../../domain/interfaces/repository/company/company-repository.interface';
import { ISubscriptionPlanRepository } from '../../../../domain/interfaces/repository/admin/subscription-plan.repository.interface';
import { IUserRepository } from '../../../../domain/interfaces/repository/user/user-repository.interface';
import { toUserSubscriptionDTO, toSubscriptionDetailsDTO } from '../../../mappers/user/subscription-details.mapper';

export class GetSubscriptionDetailsUseCase implements IGetSubscriptionDetailsUseCase {
  constructor(
    private readonly _userSubscriptionRepository: IUserSubscriptionRepository,
    private readonly _companyRepository: ICompanyRepository,
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
    private readonly _userRepository: IUserRepository
  ) {}

  async execute(userId: string): Promise<SubscriptionDetailsDTO> {
    const personalSub = await this._userSubscriptionRepository.findOne({
      userId,
      status: 'active',
    });
    let personalSubDTO;
    if (personalSub) {
      const plan = await this._subscriptionPlanRepository.findById(personalSub.getSubscriptionPlanId());
      if (plan) {
        personalSubDTO = toUserSubscriptionDTO(personalSub, plan);
      }
    }

    const user = await this._userRepository.findById(userId);
    let companySubData;
    if (user && user.CompanyId) {
      const company = await this._companyRepository.findById(user.CompanyId);
      if (company && company.planId) {
        const plan = await this._subscriptionPlanRepository.findById(company.planId);
        if (plan) {
          companySubData = { company, plan };
        }
      }
    }

    return toSubscriptionDetailsDTO(personalSubDTO, companySubData);
  }
}
