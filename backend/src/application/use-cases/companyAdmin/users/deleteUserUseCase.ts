import { IDeleteCompanyUserUseCase } from "../../interfaces/companyAdmin/IDeleteCompanyUserUseCase";
import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { MESSAGES } from "../../../../domain/constants/messages";
export class deleteCompanyUserUseCase implements IDeleteCompanyUserUseCase{
    constructor(
        private _baseRepoUser:IBaseRepository<any>
    ){}
    async deleteUser(companyUserId:string):Promise<void>{ 
        if(!companyUserId){
            throw new Error(MESSAGES.SOMETHING_WENT_WRONG);
        }
        await this._baseRepoUser.delete(companyUserId);
    
    }
}