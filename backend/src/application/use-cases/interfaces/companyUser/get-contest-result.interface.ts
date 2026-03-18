import { contestResultDTO } from "../../../DTOs/companyAdmin/contest-result.dto";
export interface IGetContestResultUseCase{
    execute(contestId: string): Promise<contestResultDTO[]>;  
}