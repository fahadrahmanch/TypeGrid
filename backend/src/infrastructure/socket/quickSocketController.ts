import { IFinishQuickPlayResult } from "../../application/use-cases/interfaces/user/quickPlayUseCases/IFInishQuickPlayResultUseCase";
import { IGetJoinMemberUseCase } from "../../application/use-cases/interfaces/user/quickPlayUseCases/IGetQuickPlayDataUseCase";
import { QuicKPlayResult } from "../../application/DTOs/user/CompetitionDTOQuickPlay";
export class quickSocketController {
    constructor(
        private readonly _getJoinMemberUseCase: IGetJoinMemberUseCase,
        private readonly _finishQuickPlayResultUseCase:IFinishQuickPlayResult
    ) { }

    async getQuickPlayData(competitionId: string, userId: string){

            if (!competitionId || !userId) {
               throw new Error("competitionId or userId missing");
            }
            const member = await this._getJoinMemberUseCase.execute(
                competitionId,      
                userId,
            );

            return member;
            
       
    }
      async saveQuickPlayResult(gameId:string,resultArray:QuicKPlayResult[]):Promise<void>{
            try{
            await this._finishQuickPlayResultUseCase.execute(gameId,resultArray);
            }
            catch(error:any){
                console.log("Error in saveGroupPlayResult:",error);
            }
        } 
}
