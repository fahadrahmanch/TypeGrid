import { groupDTO } from "../../../../DTOs/user/groupDto"
export interface IRemoveMemberGroupPlayGroupUseCase{
    execute(groupId:string,userId:string):Promise<groupDTO>
}