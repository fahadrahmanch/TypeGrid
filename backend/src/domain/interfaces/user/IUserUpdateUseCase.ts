import { AuthUserEntity } from "../../entities";

export interface IUserUpdateUseCase{
    execute(data:any):Promise<void>
}