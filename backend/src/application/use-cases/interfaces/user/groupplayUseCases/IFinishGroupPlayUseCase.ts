import { GroupPlayResult } from "../../../../DTOs/user/groupPlayDTO";
export interface IFinishGroupPlayUseCase{
    execute(gameId:string,resultArray:GroupPlayResult[]):Promise<void>
}