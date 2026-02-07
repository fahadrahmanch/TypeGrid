import { CompetitionDTOGroupPlay } from "../../../../DTOs/user/CompetitionDTOGroupPlay";
export interface IStartGameGroupPlayGroupUseCase{
    execute(groupId:string,startTime:number):Promise<CompetitionDTOGroupPlay>
}