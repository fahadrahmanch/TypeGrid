import { AuthUserEntity } from "../../../entities";

export interface IAddUserUseCase{
    addUser(data:any):Promise<AuthUserEntity>
}