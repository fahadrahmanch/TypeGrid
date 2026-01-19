import { AuthUserEntity } from "../../../../domain/entities";
export interface IGetUsersUseCase{
     execute():Promise<AuthUserEntity[]>
}
