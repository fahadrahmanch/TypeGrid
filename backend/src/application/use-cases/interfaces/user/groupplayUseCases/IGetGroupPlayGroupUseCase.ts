import { groupDTO } from "../../../../DTOs/user/groupDto";
export interface IGetGroupPlayGroupUseCase{
    execute(joinLink:string):Promise<groupDTO>
}   