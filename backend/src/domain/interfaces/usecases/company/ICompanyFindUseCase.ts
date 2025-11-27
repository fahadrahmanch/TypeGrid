import { companyEntity } from "../../../entities/CompanyEntiriy";

export interface IcompanyFindUseCase{
     execute(companyID:string):Promise<companyEntity>
}