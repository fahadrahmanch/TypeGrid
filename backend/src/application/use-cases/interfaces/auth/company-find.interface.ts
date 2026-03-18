import { CompanyEntity } from "../../../../domain/entities";

export interface ICompanyFindUseCase {
  execute(companyID: string): Promise<CompanyEntity>;
}
