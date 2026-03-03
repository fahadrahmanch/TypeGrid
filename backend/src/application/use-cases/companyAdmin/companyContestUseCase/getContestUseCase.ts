import { MESSAGES } from "../../../../domain/constants/messages";
import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { ContestProps } from "../../../DTOs/companyAdmin/CompanyContestDTO";
import { IGetContestUseCase } from "../../interfaces/companyAdmin/IGetContestUseCase";
import { mapContestDTOAdmin } from "../../../DTOs/companyAdmin/CompanyContestDTO";
export class getContestUseCase implements IGetContestUseCase{
    constructor(
        private readonly _baseRepoContest:IBaseRepository<any>,
        private readonly _baseRepoUser:IBaseRepository<any>,
    ){

    }
    async execute(contestId:string,userId:string):Promise<ContestProps>{
        const user=await this._baseRepoUser.findById(userId);
        if(!user){
            throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
        }
        const contest=await this._baseRepoContest.findById(contestId)
        if(!contest){
            throw new Error(MESSAGES.CONTEST_NOT_FOUND)
        }

        return mapContestDTOAdmin(contest);
    }

}