import { CompetitionDTOQuickPlay } from "../../../../DTOs/user/CompetitionDTOQuickPlay"
export interface IStartQuickPlayUseCase{
    execute(userId:string):Promise<CompetitionDTOQuickPlay>
}