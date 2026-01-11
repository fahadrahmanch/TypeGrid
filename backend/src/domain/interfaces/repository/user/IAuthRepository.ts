import { IBaseRepository } from "../IBaseRepository";
import { AuthUserEntity } from "../../../entities";
export interface  IAuthRepostory extends IBaseRepository<AuthUserEntity>{
findByEmail(email:string):Promise<AuthUserEntity|null>
}