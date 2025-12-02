import { IUserUpdateUseCase } from "../../../domain/interfaces/user/IUserUpdateUseCase";
import { AuthUserEntity } from "../../../domain/entities";
import { IBaseRepository } from "../../../domain/interfaces/repository/user/IBaseRepository";
export class updateUserUseCase implements IUserUpdateUseCase{
    constructor(
        private _baseRepository:IBaseRepository< AuthUserEntity>
        
    ){}
    async execute(data:any):Promise<void>{
    await this._baseRepository.update(data)
    }
}