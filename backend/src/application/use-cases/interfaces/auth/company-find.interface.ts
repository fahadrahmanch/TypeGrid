import { CompanyEntity } from "../../../../domain/entities/company.entity";

export interface ICompanyFindUseCase {
  execute(companyID: string): Promise<CompanyEntity>;
}
