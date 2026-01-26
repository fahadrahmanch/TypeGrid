
import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { CompanyLessonDTO } from "../../../DTOs/companyAdmin/companyLessonDTO";
import { IGetAdminLessonsUseCase } from "../../interfaces/companyAdmin/IGetAdminLessonUseCase";
import { MESSAGES } from "../../../../domain/constants/messages";
import { mapLessonDTOforCompanyLesson } from "../../../DTOs/companyAdmin/companyLessonDTO";
export class getAdminLessonsUseCase implements IGetAdminLessonsUseCase{
    constructor(
        private _lessonRepo: IBaseRepository<any>
    ){}
    async execute( ):Promise<CompanyLessonDTO[]>{
        const lessons=await this._lessonRepo.find({createdBy:'admin'})
        if(!lessons){
            throw new Error(MESSAGES.LESSON_NOT_FOUND);
        }
        const lessonDTOs = lessons.map(mapLessonDTOforCompanyLesson);
        return lessonDTOs
    }
}   