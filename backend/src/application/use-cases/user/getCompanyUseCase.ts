import { IGetCompanyUseCase } from "../interfaces/user/IGetCompanyUseCase";
import { ICompanyRepository } from "../../../domain/interfaces/repository/company/ICompanyRepository";
export class getCompanyUseCase implements IGetCompanyUseCase {
  constructor(private companyRepository: ICompanyRepository) {}
  async execute(companyId: string): Promise<any> {
    const company = await this.companyRepository.findById(companyId);
    return company;
  }
}
