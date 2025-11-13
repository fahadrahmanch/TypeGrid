import { InterfaceUser } from "../../../../domain/interfaces/user/InterfaceUser";
import { User } from "../../models/userSchema";
import { IUserRepostory } from "../../../../domain/interfaces/repository/user/IUserRepository";
export class userRepository implements IUserRepostory{
    constructor(){
        
    }
    async findByEmail(email:string):Promise<InterfaceUser|null>{
        return await User.findOne({email});
    }
    
}