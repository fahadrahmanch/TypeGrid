import { QuicKPlayResult } from "../../../../DTOs/user/CompetitionDTOQuickPlay"
export interface IFinishQuickPlayResult{
    execute(gameId:string,resultArray:QuicKPlayResult[]):Promise<void>
}