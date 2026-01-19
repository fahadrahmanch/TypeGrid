import { groupDTO } from "../../../../DTOs/user/groupDto"
export interface ICreateGroupPlayRoomUseCase{
    execute(hostUserId:string):Promise<groupDTO>
}