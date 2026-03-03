import { IGetOpenContestsUseCase } from "../interfaces/companyUser/IGetOpenContestsUseCase";
import { IBaseRepository } from "../../../domain/interfaces/repository/IBaseRepository";
import { MESSAGES } from "../../../domain/constants/messages";
import { openContestDTO } from "../../DTOs/companyAdmin/CompanyContestDTO";
import { mapOpenContestDTO } from "../../DTOs/companyAdmin/CompanyContestDTO";
export class getOpenContestsUseCase implements IGetOpenContestsUseCase{
    constructor(
        private readonly _baseRepoContest:IBaseRepository<any>,
        private readonly _baseRepoUser:IBaseRepository<any>
    ){}
    async execute(userId:string):Promise<openContestDTO[]>{
        if(!userId){
            throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
        }
        const user=await this._baseRepoUser.findById(userId);
        if(!user){
            throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
        }
       const contests = await this._baseRepoContest.find({
  CompanyId: user.CompanyId,
  status: "upcoming",
  contestMode: "open",
  date: {
    $gt: new Date()
  }
});
        
       return mapOpenContestDTO(contests,userId);
    }
}