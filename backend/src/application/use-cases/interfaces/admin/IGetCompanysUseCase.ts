import { companyEntity } from "../../../../domain/entities/CompanyEntity";

export interface IGetCompanysUseCase {
  execute(): Promise<companyEntity[]>;
}
