import { INewGroupPlayUseCase } from "../../interfaces/user/groupplayUseCases/INewGroupPlayUseCase";
import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { CompetitionEntity } from "../../../../domain/entities/CompetitionEntity";
import { GroupEntity } from "../../../../domain/entities/GroupEntity";

import { mapCompetitionToDTOGroupPlay } from "../../../DTOs/user/CompetitionDTOGroupPlay";
import { CompetitionDTOGroupPlay } from "../../../DTOs/user/CompetitionDTOGroupPlay";

export class newGroupPlayUseCase implements INewGroupPlayUseCase{
    constructor(
       private _baseRepoGroup:IBaseRepository<any>,
       private _baseRepoUser:IBaseRepository<any>,
       private _baseRepoCompetition:IBaseRepository<any>,
       private _baseRepoLesson:IBaseRepository<any>,
    ){}
    
    async execute(gameId:string,users:string[]):Promise<CompetitionDTOGroupPlay>{
      const compatitionData=await this._baseRepoCompetition.findById(gameId);
      if(compatitionData.status!=="completed"){
        throw new Error("Cannot start a new game. The current game is not completed yet.");
      }
      if(!compatitionData){
        throw new Error("Competition not found with the provided game ID.");
      }
        const competitionEntity=new CompetitionEntity(compatitionData);
        const groupId=competitionEntity.getGroupId();
        if(!groupId){
            throw new Error("No group associated with this competition.");
        }
        const groupData=await this._baseRepoGroup.findById(groupId);
        if(!groupData){
            throw new Error("Group not found with the associated group ID.");
        }
        const groupEntity=new GroupEntity(groupData);
        groupEntity.setGroupMembers(users);
        groupEntity.setStatus("started");
        const updatedGroup=await groupEntity.toObject();
        await this._baseRepoGroup.update(updatedGroup);
        const JoinLink=groupEntity.getJoinLink();
        const difficulty=groupEntity.getDifficulty();
        const level= difficulty==="easy"?"beginner":difficulty==="medium"?"intermediate":"advanced";
        const lessons=await this._baseRepoLesson.find({level:level,createdBy:"admin"});
        if (!lessons.length) {
        throw new Error("No lessons found for this level");
        }
        let randomIndex=Math.floor(Math.random()*lessons.length);
        let selectedLesson=lessons[randomIndex];
        const newCompetitionEntity=new CompetitionEntity({
            type:"group",
            mode:"global",
            textId: selectedLesson._id.toString(),
            participants:users,
            groupId:groupId,
            duration: 100,
            status:"ongoing",
            startTime: compatitionData.startTime ||10
           });
           const competitionObject=await newCompetitionEntity.toObject();
           const newCompetition=await this._baseRepoCompetition.create(competitionObject);
              const populatedParticipants = await Promise.all(
      newCompetitionEntity.getParticipants().map((item: any) =>
        this._baseRepoUser.findById(item)
      )
      );   
      
     const responseCompetition = {
    ...newCompetition,
    participants: populatedParticipants,
    lesson: selectedLesson,
    joinLink: JoinLink,
    };
    return mapCompetitionToDTOGroupPlay(responseCompetition, groupEntity.getOwnerId());
    
}   
}