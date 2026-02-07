import { ICreateSoloPlayUseCase } from "../../interfaces/user/soloPlayUserCases/ICreateSoloPlayUseCase";
import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CompetitionEntity } from "../../../../domain/entities/CompetitionEntity";
import { CompetitionDTOSoloPlay } from "../../../../application/DTOs/user/CompetitionDTOSoloPlay";
import { mapCompetitionToDTOSoloPlay } from "../../../../application/DTOs/user/CompetitionDTOSoloPlay";
export class CreateSoloPlayUseCase implements ICreateSoloPlayUseCase{
    constructor(
        private _baseRepoLesson:IBaseRepository<any>,
        private _baseRepoCompetion:IBaseRepository<any>,
        private _baseRepoUser:IBaseRepository<any>
    ){

    }
    async execute(userId:string):Promise<CompetitionDTOSoloPlay>{
    const user=await this._baseRepoUser.findById(userId);
    if(!user){
        throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const Lessons=await this._baseRepoLesson.find();
    if(!Lessons){
        throw new Error(MESSAGES.LESSON_NOT_FOUND);
    }
    const selectedLesson=Lessons[Math.floor(Math.random() * Lessons.length)];
    const competition=new CompetitionEntity({
        type:"solo",
        mode:"global",
        participants:[user._id],
        textId:selectedLesson._id,
        duration:300,
        startTime:10,
        status:"ongoing",
    });
    const CompetitionObject=competition.toObject();
    const createdCompetition=await this._baseRepoCompetion.create(CompetitionObject);
     
    const populatedParticipants = await Promise.all(
      competition.getParticipants().map((item: any) =>
        this._baseRepoUser.findById(item)
      )
    );
     const responseCompetition = {
    ...createdCompetition,
    participants: populatedParticipants,
    lesson: selectedLesson,
    
  };
 
    return mapCompetitionToDTOSoloPlay(responseCompetition);
}   }