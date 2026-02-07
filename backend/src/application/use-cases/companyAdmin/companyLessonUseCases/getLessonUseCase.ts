import { IGetLessonUseCase } from "../../interfaces/companyAdmin/IGetLessonUseCase";
import { CompanyLessonDTO } from "../../../DTOs/companyAdmin/companyLessonDTO";
import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { mapLessonDTOforCompanyLesson } from "../../../DTOs/companyAdmin/companyLessonDTO";
export class getLessonUseCase implements IGetLessonUseCase{
    constructor(
        private BaseRepoLessonL:IBaseRepository<any>
    ){}
    async execute(lessonId: string): Promise<CompanyLessonDTO> {
        if(!lessonId){
            throw new Error("Lesson ID is required");
        }
        const lesson=await this.BaseRepoLessonL.findById(lessonId);
        if (!lesson) {
          throw new Error("Lesson not found");
        }
        return mapLessonDTOforCompanyLesson(lesson);
    }

}