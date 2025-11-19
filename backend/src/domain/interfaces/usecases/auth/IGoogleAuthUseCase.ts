import { AuthUserEntity } from "../../../entities";
export interface IGoogleAuthUseCase{
    gooogleAuth(name:string,email:string,googleId:string):Promise<AuthUserEntity|void>
}