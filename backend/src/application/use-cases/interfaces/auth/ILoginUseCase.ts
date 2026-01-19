import { AuthUserEntity } from "../../../../domain/entities";
export interface ILoginUseCase{
    execute(email:string,password:string):Promise<AuthUserEntity|void>
}