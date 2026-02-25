import { ContestProps } from "../../../DTOs/companyAdmin/CompanyContestDTO";
export interface IGetContestDataUseCase{
    execute(contestId:string,userId:string):Promise<ContestProps>
}