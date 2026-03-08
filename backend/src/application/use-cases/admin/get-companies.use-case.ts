import { CompanyEntity } from "../../../domain/entities";
import { IGetCompaniesUseCase } from "../interfaces/admin/get-companies.interface";
import { ICompanyRepository } from "../../../domain/interfaces/repository/company/company-repository.interface";
export class GetCompaniesUseCase implements IGetCompaniesUseCase {
  constructor(private companyRepository: ICompanyRepository) {}
  async execute(): Promise<CompanyEntity[]> {
    const companies = await this.companyRepository.find();
    return companies;
  }
}
