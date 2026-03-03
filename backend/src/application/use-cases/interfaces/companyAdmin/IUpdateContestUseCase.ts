import { CreateContestDTO } from "../../../DTOs/companyAdmin/CompanyContestDTO"
export interface IUpdateContestUseCase{
     execute(constestId:string,data:CreateContestDTO):Promise<CreateContestDTO>
}