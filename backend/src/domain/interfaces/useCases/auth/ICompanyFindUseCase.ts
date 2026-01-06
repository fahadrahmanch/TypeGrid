import { companyEntity } from "../../../entities/user/CompanyEntiriy";

export interface IcompanyFindUseCase{
     execute(companyID:string):Promise<companyEntity>
}