import { IStartGameGroupPlayGroupUseCase } from "../../interfaces/user/groupplayUseCases/IStartGameGroupPlayGroupUseCase";
import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { CompetitionEntity } from "../../../../domain/entities/CompetitionEntity";
import { mapLessonDTOforGroupPlay } from "../../../DTOs/admin/lessonManagement.dto";
import { mapCompetitionToDTOGroupPlay } from "../../../DTOs/user/CompetitionDTOGroupPlay";
import { CompetitionDTOGroupPlay } from "../../../DTOs/user/CompetitionDTOGroupPlay";
import { Console } from "console";
export class StartGameGroupPlayGroupUseCase implements IStartGameGroupPlayGroupUseCase{
    constructor(
       private _baseRepoCompetion:IBaseRepository<any>,
       private _baseRepoGroup:IBaseRepository<any>,
       private _baseRepoLesson:IBaseRepository<any>,
       private _baseRepoUser:IBaseRepository<any>

    ){}
    async execute(groupId:string,startTime:number):Promise<CompetitionDTOGroupPlay>{
     const group=await this._baseRepoGroup.findById(groupId)
     if(!group){
        throw new Error("Group not found")
     }
     const participants=group.members.map((item:any)=>item.toString())
       const difficultyToLevelMap: Record<string, string> = {
    easy: "beginner",
    medium: "intermediate",
    hard: "advanced",
  };
     const level=difficultyToLevelMap[group.difficulty];
    
     console.log("level",level)
     const lessons=await this._baseRepoLesson.find({level,createdBy:"admin"})
     console.log("lessons",lessons)
    if (!lessons.length) {
      throw new Error("No lessons found for this level");
    }
     let randomIndex=Math.floor(Math.random()*lessons.length)
     let selectedLesson=mapLessonDTOforGroupPlay(lessons[randomIndex])
     const competitionEntity=new CompetitionEntity({
      type:"group",
      mode:'global',
      textId: selectedLesson.id,
      participants,
      groupId:group._id.toString(),
      duration: 3000,
      status:'ongoing',
      startTime,
     })
     console.log("startey",competitionEntity)
     const competitionObject=await competitionEntity.toObject()
     const competition=await this._baseRepoCompetion.create(competitionObject)
     const populatedParticipants = await Promise.all(
      competitionEntity.getParticipants().map((item: any) =>
        this._baseRepoUser.findById(item)
      )
    );
     const responseCompetition = {
    ...competition.toObject(),
    participants: populatedParticipants,
    lesson: selectedLesson,
    
  };
  return mapCompetitionToDTOGroupPlay(responseCompetition, group.ownerId);
    }

}