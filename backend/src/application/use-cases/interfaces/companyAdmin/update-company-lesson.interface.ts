import { CompanyLessonDTO } from "../../../DTOs/companyAdmin/company-lesson.dto";
export interface IUpdateCompanyLessonUseCase {
  execute(lessonId: string, lessonData: CompanyLessonDTO): Promise<CompanyLessonDTO>;
}
