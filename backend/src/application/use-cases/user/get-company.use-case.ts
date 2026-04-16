import { IGetCompanyUseCase } from '../interfaces/user/get-company.interface';
import { ICompanyRepository } from '../../../domain/interfaces/repository/company/company-repository.interface';
import { CustomError } from '../../../domain/entities/custom-error.entity';
import { HttpStatusCodes } from '../../../domain/enums/http-status-codes.enum';
import { MESSAGES } from '../../../domain/constants/messages';
export class GetCompanyUseCase implements IGetCompanyUseCase {
  constructor(private companyRepository: ICompanyRepository) {}
  async execute(companyId: string): Promise<any> {
    const company = await this.companyRepository.findById(companyId);
    if (!company) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.COMPANY_NOT_FOUND);
    }
    return company;
  }
}
