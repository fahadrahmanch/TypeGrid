import { CompanyGroupDTO } from "../../../DTOs/companyAdmin/companyGroupDTO";


export interface ICreateCompanyGroupUseCase{
    execute(groupData:CompanyGroupDTO,userId:string):Promise<void>;
}