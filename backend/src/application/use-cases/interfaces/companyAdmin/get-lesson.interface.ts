import { CompanyLessonDTO } from "../../../DTOs/companyAdmin/company-lesson.dto";
export interface IGetLessonUseCase {
  execute(lessonId: string): Promise<CompanyLessonDTO>;
}
