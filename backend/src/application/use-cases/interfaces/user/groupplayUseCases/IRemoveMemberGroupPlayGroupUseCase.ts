import { groupDTO } from "../../../../DTOs/user/groupDto"
export type RemoveReason = "KICK" | "LEAVE";
export interface IRemoveMemberGroupPlayGroupUseCase{
    execute(groupId:string,userId:string,reason:RemoveReason):Promise<groupDTO>
}