import { CompanyLessonDTO } from "../../../DTOs/companyAdmin/companyLessonDTO"
export interface IUpdateCompanyLessonUseCase{
    execute(lessonId:string,lessonData:CompanyLessonDTO):Promise<CompanyLessonDTO>
}