import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { ResultEntity } from "../../../../domain/entities/ResultEntity";
import { CompetitionEntity } from "../../../../domain/entities/CompetitionEntity";
import { QuicKPlayResult } from "../../../DTOs/user/CompetitionDTOQuickPlay";
export class finishQuickPlayResultUseCase{
     constructor(
        private _baseRepoCompetition:IBaseRepository<any>,
        private _baseRepoResult:IBaseRepository<any>,
        ){}
        async execute(gameId:string,resultArray:QuicKPlayResult[]):Promise<void>{
            const competition=await this._baseRepoCompetition.findById(gameId);
            const competitionEntity=new CompetitionEntity({id:competition._id,...competition});
            competitionEntity.setStatus("completed");
            const updatedCompetition=competitionEntity.toObject();
            await this._baseRepoCompetition.update(updatedCompetition);           
           
            for(const result of resultArray){
                const resultEntity=new ResultEntity({
                    userId:result.userId,
                    competitionId:gameId,
                    type:"quick",
                    result:{
                        wpm:result.wpm,
                        accuracy:Number(result.accuracy),
                        errors:result.errors,
                        time:result.timeTaken,
                        rank:result.rank
                    }
                });
                const resultObject=await resultEntity.toObject();
                await this._baseRepoResult.create(resultObject); 
            }
        }   
}