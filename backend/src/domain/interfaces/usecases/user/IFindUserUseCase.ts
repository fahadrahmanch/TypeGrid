import { AuthUserEntity } from "../../../entities";
export interface IFindUserUseCase {
    execute(email:string):Promise<AuthUserEntity|null>
}