import { IGetCompanyUseCase } from "../interfaces/user/get-company.interface";
import { ICompanyRepository } from "../../../domain/interfaces/repository/company/company-repository.interface";
export class GetCompanyUseCase implements IGetCompanyUseCase {
  constructor(private companyRepository: ICompanyRepository) {}
  async execute(companyId: string): Promise<any> {
    const company = await this.companyRepository.findById(companyId);
    return company;
  }
}
