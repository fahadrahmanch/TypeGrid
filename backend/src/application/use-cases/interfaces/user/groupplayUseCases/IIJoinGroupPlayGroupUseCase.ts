import { groupDTO } from "../../../../DTOs/user/groupDto";
export interface IJoinGroupPlayGroupUseCase{
    execute(joinLink:string,userId:string):Promise<groupDTO>
}