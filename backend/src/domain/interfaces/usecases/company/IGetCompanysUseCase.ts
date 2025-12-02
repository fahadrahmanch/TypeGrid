import { companyEntity } from "../../../entities/CompanyEntiriy";

export interface IGetCompanysUseCase{
    execute():Promise<companyEntity[]>
}