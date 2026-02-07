import { groupDTO } from "../../../../DTOs/user/groupDto";
export interface IEditGroupPlayUseCase{
    execute(groupId:string,difficulty:string,maxPlayers:number,userId:string):Promise<groupDTO>
}