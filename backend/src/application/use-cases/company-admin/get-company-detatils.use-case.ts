import { IGetCompanyDetailsUseCase } from '../interfaces/companyAdmin/get-company-details.interface';
import { ICompanyRepository } from '../../../domain/interfaces/repository/company/company-repository.interface';
import { CustomError } from '../../../domain/entities/custom-error.entity';
import { HttpStatusCodes } from '../../../domain/enums/http-status-codes.enum';
import { MESSAGES } from '../../../domain/constants/messages';
import { ISubscriptionPlanRepository } from '../../../domain/interfaces/repository/admin/subscription-plan.repository.interface';
import { IUserRepository } from '../../../domain/interfaces/repository/user/user-repository.interface';
import { CompanyDetailsDTO } from '../../DTOs/companyAdmin/company-details.dto';
import { CompanyDetailsMapper } from '../../mappers/companyAdmin/company-details.mapper';

export class GetCompanyDetailsUseCase implements IGetCompanyDetailsUseCase {
  constructor(
    private readonly _companyRepository: ICompanyRepository,
    private readonly _subscriptionRepository: ISubscriptionPlanRepository,
    private readonly _userRepository: IUserRepository
  ) {}

  async execute(userId: string): Promise<CompanyDetailsDTO> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }

    if (!user.CompanyId) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.COMPANY_NOT_FOUND);
    }

    const company = await this._companyRepository.findById(user.CompanyId);
    if (!company) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.COMPANY_NOT_FOUND);
    }

    const subscription = await this._subscriptionRepository.findById(company.planId!);
    if (!subscription) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.SUBSCRIPTION_NOT_FOUND);
    }

    return CompanyDetailsMapper.toDTO(company, subscription);
  }
}
