import { CreateContestDTO } from "../../../DTOs/companyAdmin/CompanyContestDTO";
export interface ICreateCompanyContestUseCase{
    execute(data:CreateContestDTO,userId:string):Promise<CreateContestDTO>
}