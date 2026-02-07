import { IGetCompanyLessonsUseCase } from "../../interfaces/companyAdmin/IGetCompanyLessonsUseCase";
import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import {MESSAGES} from "../../../../domain/constants/messages";
import { mapLessonDTOforCompanyLesson } from "../../../../application/DTOs/companyAdmin/companyLessonDTO";
import { CompanyLessonDTO } from "../../../../application/DTOs/companyAdmin/companyLessonDTO";
export class getCompanyLessonUseCase implements IGetCompanyLessonsUseCase{
   constructor(private _baseRepositoryLesson:IBaseRepository<any>,private _baseRepositoryUser:IBaseRepository<any>){}
   async execute(userId:string):Promise<CompanyLessonDTO[]>{
            const user=await this._baseRepositoryUser.findById(userId);
            if(!user){
                throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
            }
            const companyId=user.CompanyId;
            const lessons=await this._baseRepositoryLesson.find({companyId});
            if(!lessons.length){
                throw new Error(MESSAGES.LESSON_NOT_FOUND);
            }
            
            return lessons.map((lesson) =>
  mapLessonDTOforCompanyLesson(lesson)
);    
    }
}