import { IJoinOrLeaveContestUseCase } from "../interfaces/companyUser/IoinOrLeaveContestUseCase";
import { IBaseRepository } from "../../../domain/interfaces/repository/IBaseRepository";
import { MESSAGES } from "../../../domain/constants/messages";
import { ContestEntity } from "../../../domain/entities/companyContestEntity";
import { openContestDTO } from "../../../application/DTOs/companyAdmin/CompanyContestDTO";
import { mapContestDTO } from "../../../application/DTOs/companyAdmin/CompanyContestDTO";
export class joinOrLeaveContestUseCase implements IJoinOrLeaveContestUseCase{
    constructor(
       private readonly _baseRepoContest:IBaseRepository<any>,
       private readonly _baseRepoUser:IBaseRepository<any>
    )
    {}
    async execute(userId:string,contestId:string,action:string):Promise<openContestDTO>{
        if(!userId){
            throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
        }
        const user=await this._baseRepoUser.findById(userId);
        if(!user){
            throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
        }
        const contest=await this._baseRepoContest.findById(contestId);
        if(!contest){
            throw new Error(MESSAGES.CONTEST_NOT_FOUND);
        }
        const contestEntity=new ContestEntity(contest);
        if(action=="join"){
            contestEntity.joinContest(userId);
        }
        else if(action=="cancel"){
            contestEntity.unJoin(userId);
        }
        const Object=contestEntity.toObject();
        const contests= await this._baseRepoContest.update({_id:contestId,participants:Object.participants});
        return mapContestDTO(contests,userId);
   
    }
}