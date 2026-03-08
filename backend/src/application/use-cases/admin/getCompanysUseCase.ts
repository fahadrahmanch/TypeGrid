import { companyEntity } from "../../../domain/entities";
import { IGetCompanysUseCase } from "../interfaces/admin/IGetCompanysUseCase";
import { ICompanyRepository } from "../../../domain/interfaces/repository/company/ICompanyRepository";
export class getCompanysUseCase implements IGetCompanysUseCase {
  constructor(private companyRepository: ICompanyRepository) {}
  async execute(): Promise<companyEntity[]> {
    const companies = await this.companyRepository.find();
    return companies;
  }
}
