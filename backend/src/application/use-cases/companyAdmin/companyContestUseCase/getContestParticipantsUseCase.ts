import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { IGetContestParticipantsUseCase } from "../../interfaces/companyAdmin/IGetContestParticipantsUseCase";
import { MESSAGES } from "../../../../domain/constants/messages";
import { ParticipantsDTO } from "../../../DTOs/companyAdmin/CompanyContestDTO";
export class getContestParticipantsUseCase implements IGetContestParticipantsUseCase{
    constructor(
    private _baseRepoContest:IBaseRepository<any>,
    private _baseRepoUser:IBaseRepository<any>
    ){}
    async execute(contestId:string,userId:string):Promise<ParticipantsDTO[]>{
    const contest=await this._baseRepoContest.findById(contestId)
    if(!contest){
    throw new Error(MESSAGES.CONTEST_NOT_FOUND)
    }
   let participants = await Promise.all(
  contest.participants.map(async (item: any) => {
    const user = await this._baseRepoUser.findById(item);
    return { name: user.name, email: user.email };
  })
);

return participants
    }
}
