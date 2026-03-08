import { CompanyLessonDTO } from "../../../DTOs/companyAdmin/company-lesson.dto";
export interface IGetAdminLessonsUseCase {
  execute(): Promise<CompanyLessonDTO[]>;
}
