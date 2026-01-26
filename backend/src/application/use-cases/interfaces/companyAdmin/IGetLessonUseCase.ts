import { CompanyLessonDTO } from "../../../DTOs/companyAdmin/companyLessonDTO";
export interface IGetLessonUseCase{
    execute(lessonId: string): Promise<CompanyLessonDTO>;
}