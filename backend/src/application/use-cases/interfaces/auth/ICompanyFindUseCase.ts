import { companyEntity } from "../../../../domain/entities/user/CompanyEntity";

export interface IcompanyFindUseCase{
     execute(companyID:string):Promise<companyEntity>
}