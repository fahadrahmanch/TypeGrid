import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { IGetCompanyContestsUsecase } from "../../interfaces/companyAdmin/IGetCompanyContestsUseCase";
import { mapCompanyContestDTO,ContestProps } from "../../../DTOs/companyAdmin/CompanyContestDTO";
export class getCompanyContestsUseCase implements IGetCompanyContestsUsecase{
    constructor(
        private _baseRepoContest:IBaseRepository<any>,
        private _baseRepoUser:IBaseRepository<any>
    ){}
    async execute(userId:string):Promise<ContestProps[]>{
        const user=await this._baseRepoUser.findById(userId);
        if(!user){
            throw new Error("User not found");
        }
        const contests=await this._baseRepoContest.find({
            companyId:user.companyId
        });
        if(!contests){
            throw new Error("Contests not found");
        }
        return mapCompanyContestDTO(contests,userId);
     
    }
}