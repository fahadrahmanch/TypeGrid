import { CompetitionDTOGroupPlay } from "../../../../DTOs/user/CompetitionDTOGroupPlay";
export interface INewGroupPlayUseCase{
    execute(gameId:string,users:string[]):Promise<CompetitionDTOGroupPlay>
}   