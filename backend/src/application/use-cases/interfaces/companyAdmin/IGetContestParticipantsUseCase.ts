import { ParticipantsDTO } from "../../../DTOs/companyAdmin/CompanyContestDTO"
export interface IGetContestParticipantsUseCase{
    execute(contestId:string,userId:string):Promise<ParticipantsDTO[]>
}