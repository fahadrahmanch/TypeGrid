import { ICreateCompanyLessonUseCase } from "../../../../application/use-cases/interfaces/companyAdmin/ICreateCompanyLessonUseCase";
import { CompanyLessonDTO } from "../../../../application/DTOs/companyAdmin/companyLessonDTO";
import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { MESSAGES } from "../../../../domain/constants/messages";
import { LessonEntity } from "../../../../domain/entities/LessonEntity";
import { mapLessonDTOforCompanyLesson } from "../../../../application/DTOs/companyAdmin/companyLessonDTO";
export class CreateCompanyLessonUseCase implements ICreateCompanyLessonUseCase{
    constructor(
        private _baseRepositoryLesson:IBaseRepository<any>,
        private _baseRepositoryUser:IBaseRepository<any>
    ){}
    async execute(userId:string,data:Partial<CompanyLessonDTO>):Promise<CompanyLessonDTO>{
        const user=await this._baseRepositoryUser.findById(userId);
        if(!user){
            throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
        }
        if(user.role!="companyAdmin"){
            throw new Error(MESSAGES.UNAUTHORIZED);
        }
        const companyId=user.CompanyId;
        data.companyId=companyId;
        if(!companyId){
            throw new Error(MESSAGES.INVALID_COMPANY_REFERENCE);
        }
        const lesson=new LessonEntity({...data,createdBy:"company"});
        const createdLesson=await this._baseRepositoryLesson.create(lesson);
        return mapLessonDTOforCompanyLesson(createdLesson);
    }
}       