import { ISoloPlayResultUseCase } from "../../interfaces/user/soloPlayUserCases/ISoloPlayResultUseCase";
import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { CompetitionEntity } from "../../../../domain/entities/CompetitionEntity";
import { ResultEntity } from "../../../../domain/entities/ResultEntity";
export class SoloPlayResultUseCase implements ISoloPlayResultUseCase{
    constructor(
        private _competitionRepo:IBaseRepository<any>,
        private _userRepo:IBaseRepository<any>,
        private _resultRepo:IBaseRepository<any>
    ){}

    async execute(userId:string,gameId:string,result:any):Promise<void>{
    const user=await this._userRepo.findById(userId)
    if(!user){
        throw new Error("User not found")
    }
    const competition=await this._competitionRepo.findById(gameId)
    
    if(!competition){
        throw new Error("Competition not found")
    }
    const competitionEntity=new CompetitionEntity(competition)
    competitionEntity.endCompetition()
    const competitionObject=competitionEntity.toObject()
    await this._competitionRepo.update({ _id:gameId ,competitionObject})
    const resultEntity=new ResultEntity({userId,competitionId:gameId,type:"solo",result})
    const resultObject=resultEntity.toObject()
    await this._resultRepo.create(resultObject)
    }
}