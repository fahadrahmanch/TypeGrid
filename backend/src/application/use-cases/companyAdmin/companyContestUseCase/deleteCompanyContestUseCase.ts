
import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { IDeleteContestUseCase } from "../../interfaces/companyAdmin/IDeleteContestUseCase";
import { MESSAGES } from "../../../../domain/constants/messages";
export class deleteCompanyContestUse implements IDeleteContestUseCase{
    constructor(
        private _baseRepoContest:IBaseRepository<any>
    ){}
    async delete(contestId:string):Promise<void>{
        const contest=await this._baseRepoContest.findById(contestId)
        if(!contest){
            throw new Error(MESSAGES.CONTEST_NOT_FOUND)
        }
        await this._baseRepoContest.delete(contestId)

    }
}