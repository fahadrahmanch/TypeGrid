import { IBaseRepository } from "../../../domain/interfaces/repository/user/IBaseRepository";
import { IBlockUserUseCase } from "../../../domain/interfaces/usecases/admin/IBlockUserUseCase";
export class blockUserUseCase implements IBlockUserUseCase{
    constructor(
        private _baseRepoUser:IBaseRepository<any>
    ){}
    async execute(userId:string):Promise<void>{
    if(!userId){
        throw new Error("something went wrong")
    }
    const blockUser=await this._baseRepoUser.findById(userId)
    if(!blockUser){
        throw new Error("user not found")
    }
    blockUser.status=='block'?blockUser.status='active':blockUser.status='block'
    console.log('blockUser',blockUser)
    await this._baseRepoUser.update(blockUser)
    }

} 