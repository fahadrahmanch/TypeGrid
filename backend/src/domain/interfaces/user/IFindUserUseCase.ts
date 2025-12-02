import { Interface } from "readline"
import { AuthUserEntity } from "../../entities"
export interface IFindUserUseCase {
    execute(email:string):Promise<AuthUserEntity|null>
}