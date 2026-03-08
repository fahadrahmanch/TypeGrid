import { CompanyLessonDTO } from "../../../DTOs/companyAdmin/company-lesson.dto";
export interface IGetCompanyLessonsUseCase {
  execute(userId: string): Promise<CompanyLessonDTO[]>;
}
