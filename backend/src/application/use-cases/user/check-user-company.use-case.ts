import { ICheckUserCompanyUseCase } from '../interfaces/user/check-user-company.interface';
import { IUserRepository } from '../../../domain/interfaces/repository/user/user-repository.interface';
import { ICompanyRepository } from '../../../domain/interfaces/repository/company/company-repository.interface';
import { CompanyDTO } from '../../DTOs/user/company.dto';
import { mapToCompanyDTO } from '../../mappers/user/company.mapper';

export class CheckUserCompanyUseCase implements ICheckUserCompanyUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _companyRepository: ICompanyRepository
  ) {}

  async execute(userId: string): Promise<CompanyDTO | null> {
    console.log("usecase called")
    const user = await this._userRepository.findById(userId);
    if (!user || !user.CompanyId) {
      return null;
    }
    const company = await this._companyRepository.findById(user.CompanyId);
    console.log("cmpany here",company)
    return company ? mapToCompanyDTO(company) : null;
  }
}
