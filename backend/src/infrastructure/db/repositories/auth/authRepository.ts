import { User } from "../../models/userSchema";
import { IAuthRepostory } from "../../../../domain/interfaces/repository/user/IAuthRepository";
import { BaseRepository } from "../../base/BaseRepository";
import { AuthUserEntity } from "../../../../domain/entities";
export class authRepository  extends BaseRepository<AuthUserEntity> implements IAuthRepostory{
    constructor(){
        super(User);
    }
    async findByEmail(email:string):Promise<AuthUserEntity|null>{
        return await User.findOne({email});
    }
    
}