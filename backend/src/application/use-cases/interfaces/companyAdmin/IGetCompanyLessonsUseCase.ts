
import { CompanyLessonDTO } from "../../../DTOs/companyAdmin/companyLessonDTO";
export interface IGetCompanyLessonsUseCase {
    execute(userId:string):Promise<CompanyLessonDTO[]>;
}