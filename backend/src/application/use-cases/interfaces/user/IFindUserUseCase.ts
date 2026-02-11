import { AuthUserEntity } from "../../../../domain/entities";
export interface IFindUserUseCase {
    execute(email:string):Promise<AuthUserEntity|null>
}