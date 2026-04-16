import { CompanyLessonDTO } from '../../../DTOs/companyAdmin/company-lesson.dto';
export interface ICreateCompanyLessonUseCase {
  execute(userId: string, data: CompanyLessonDTO): Promise<CompanyLessonDTO>;
}
