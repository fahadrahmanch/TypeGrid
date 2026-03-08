import { CompanyEntity } from "../../../../domain/entities/company.entity";

export interface IGetCompaniesUseCase {
  execute(): Promise<CompanyEntity[]>;
}
