import { IBaseRepository } from "../../../domain/interfaces/repository/user/IBaseRepository";
import { IBlockUserUseCase } from "../../../domain/interfaces/usecases/admin/IBlockUserUseCase";
import { MESSAGES } from "../../../domain/constants/messages";
export class blockUserUseCase implements IBlockUserUseCase{
    constructor(
        private _baseRepoUser:IBaseRepository<any>
    ){}
    async execute(userId:string):Promise<void>{
    if(!userId){
        throw new Error(MESSAGES.SOMETHING_WENT_WRONG);
    }
    const blockUser=await this._baseRepoUser.findById(userId);
    if(!blockUser){
        throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
    }
    blockUser.status=="block"?blockUser.status="active":blockUser.status="block";
    await this._baseRepoUser.update(blockUser);
    }

} 