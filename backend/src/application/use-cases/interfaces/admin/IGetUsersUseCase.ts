import { InterfaceUser } from "../user/InterfaceUser";
export interface IGetUsersUseCase{
     execute():Promise<InterfaceUser[]>
}
