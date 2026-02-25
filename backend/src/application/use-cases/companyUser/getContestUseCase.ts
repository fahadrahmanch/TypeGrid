import { IGetContestUseCase } from "../interfaces/companyUser/IGetContestUseCase";
import { IBaseRepository } from "../../../domain/interfaces/repository/IBaseRepository";
import { MESSAGES } from "../../../domain/constants/messages";
import { IContestRepository } from "../../../domain/interfaces/repository/companyUser/IContestRepository";
import { ContestProps, mapContestDTO } from "../../DTOs/companyAdmin/CompanyContestDTO";
export class getContestUseCase implements IGetContestUseCase{
    constructor(
        private readonly _baseRepoContest:IBaseRepository<any>,
        private readonly _baseRepoUser:IBaseRepository<any>,
        private readonly _contestRepository:IContestRepository<any>
    ){

    }
    async execute(contestId:string,userId:string):Promise<ContestProps>{
        const user=await this._baseRepoUser.findById(userId);
        if(!user){
            throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
        }
        const isJoined=await this._contestRepository.isJoined(contestId,userId);
        if(!isJoined){
           throw new Error("You have not joined this contest");
        }
        const allowedStatuses = ["upcoming", "waiting"];

if (!allowedStatuses.includes(isJoined.status)) {
    throw new Error("Group expired");
}
        return mapContestDTO(isJoined,userId);
    }

}