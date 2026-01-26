import { BaseRepository } from "../../../../infrastructure/db/base/BaseRepository"
import { IUpdateCompanyLessonUseCase } from "../../interfaces/companyAdmin/IUpdateCompanyLessonUseCase"
import { CompanyLessonDTO } from "../../../DTOs/companyAdmin/companyLessonDTO"
import { LessonEntity } from "../../../../domain/entities/LessonEntity"
import { MESSAGES } from "../../../../domain/constants/messages"
import { mapLessonDTOforCompanyLesson } from "../../../DTOs/companyAdmin/companyLessonDTO"
export class updateCompanyLessonUseCase implements IUpdateCompanyLessonUseCase{
    constructor(
        private _baseRepoLesson:BaseRepository<any>
    ){}
    async execute(lessonId:string,lessonData:CompanyLessonDTO):Promise<CompanyLessonDTO>{
        if(!lessonId||!lessonData){
            throw new Error(MESSAGES.INVALID_REQUEST);
        }
        const lesson=await this._baseRepoLesson.findById(lessonId)
        if(!lesson){
            throw new Error(MESSAGES.COMPANY_LESSON_NOT_FOUND);
        }

        const updatedLessonData = {
  ...lesson,
  ...lessonData
};
        const lessonEntity=new LessonEntity(updatedLessonData)
        const updatedLesson=await this._baseRepoLesson.update(lessonEntity)
        return mapLessonDTOforCompanyLesson( updatedLesson)
    }
}