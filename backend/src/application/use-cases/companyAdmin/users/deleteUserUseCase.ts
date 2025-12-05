import { IDeleteCompanyUserUseCase } from "../../../../domain/interfaces/usecases/companyAdmin/IDeleteCompanyUserUseCase"
import { IBaseRepository } from "../../../../domain/interfaces/repository/user/IBaseRepository"
export class deleteCompanyUserUseCase implements IDeleteCompanyUserUseCase{
    constructor(
        private _baseRepoUser:IBaseRepository<any>
    ){}
    async deleteUser(companyUserId:string):Promise<void>{ 
        if(!companyUserId){
            throw new Error("something went wrong")
        }
        await this._baseRepoUser.delete(companyUserId)
    
    }
}