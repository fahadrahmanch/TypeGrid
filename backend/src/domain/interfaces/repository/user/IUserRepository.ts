import { InterfaceUser } from "../../user/InterfaceUser"
export interface IUserRepostory{
findByEmail(email:string):Promise<InterfaceUser|null>
}