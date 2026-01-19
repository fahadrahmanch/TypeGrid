import { InterfaceUser } from "../user/InterfaceUser";
export interface IGetCompanyUsersUseCase{
    execute(CompanyId:string):Promise<InterfaceUser[]>
}