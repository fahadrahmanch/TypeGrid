import { CompanyLessonDTO } from "../../../DTOs/companyAdmin/companyLessonDTO";
export interface IGetAdminLessonsUseCase{
    execute():Promise<CompanyLessonDTO[]>;
}
