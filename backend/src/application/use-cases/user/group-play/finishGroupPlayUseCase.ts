import { IFinishGroupPlayUseCase } from "../../interfaces/user/groupplayUseCases/IFinishGroupPlayUseCase";
import { GroupPlayResult } from "../../../DTOs/user/groupPlayDTO";
import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { CompetitionEntity } from "../../../../domain/entities/CompetitionEntity";
import { ResultEntity } from "../../../../domain/entities/ResultEntity";
import { GroupEntity } from "../../../../domain/entities/GroupEntity";
export class finishGroupPlayUseCase implements IFinishGroupPlayUseCase{
    constructor(
    private _baseRepoCompetition:IBaseRepository<any>,
    private _baseRepoGroup:IBaseRepository<any>,
    private _baseRepoResult:IBaseRepository<any>,
    ){}
    async execute(gameId:string,resultArray:GroupPlayResult[]):Promise<void>{
        const competition=await this._baseRepoCompetition.findById(gameId);
        const competitionEntity=new CompetitionEntity({id:competition._id,...competition});
        competitionEntity.setStatus("completed");
        const updatedCompetition=competitionEntity.toObject();
        await this._baseRepoCompetition.update(updatedCompetition);
        const groupId=competitionEntity.getGroupId();
       
        const group=await this._baseRepoGroup.findById(groupId!);
        const groupEntity=new GroupEntity(group);
        groupEntity.setStatus("completed");
        const updatedGroup=groupEntity.toObject();
        await this._baseRepoGroup.update(updatedGroup);
        for(const result of resultArray){
            const resultEntity=new ResultEntity({
                userId:result.userId,
                competitionId:gameId,
                type:"group",
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