import { companyEntity } from "../../../../domain/entities/CompanyEntity";

export interface IcompanyFindUseCase {
  execute(companyID: string): Promise<companyEntity>;
}
