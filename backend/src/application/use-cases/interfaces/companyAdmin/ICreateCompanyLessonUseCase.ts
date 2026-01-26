import { CompanyLessonDTO } from "../../../DTOs/companyAdmin/companyLessonDTO";
export interface ICreateCompanyLessonUseCase{
    execute(userId:string,data:CompanyLessonDTO):Promise<CompanyLessonDTO>
}