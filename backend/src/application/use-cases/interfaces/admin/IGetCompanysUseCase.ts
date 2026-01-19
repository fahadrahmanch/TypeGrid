import { companyEntity } from "../../../entities/user/CompanyEntiriy";

export interface IGetCompanysUseCase{
    execute():Promise<companyEntity[]>
}