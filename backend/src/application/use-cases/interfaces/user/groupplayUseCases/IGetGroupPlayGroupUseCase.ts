import { groupDTO } from "../../../../DTOs/user/groupDto";
export interface IGetGroupPlayGroupUseCase{
    execute(joinLink:string,userId:string):Promise<groupDTO>
}   