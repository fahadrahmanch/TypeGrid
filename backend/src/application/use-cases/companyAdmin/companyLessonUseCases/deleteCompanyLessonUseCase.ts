import { IDeleteCompanyLessonUseCase } from "../../interfaces/companyAdmin/IDeleteCompanyLessonUseCase";
import { MESSAGES } from "../../../../domain/constants/messages";
import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
export class deleteCompanyLessonUseCase implements IDeleteCompanyLessonUseCase{
    constructor(
        private _baseRepoLesson:IBaseRepository<any>
    ){}
    async execute(lessonId: string): Promise<void> {
        const lesson=await this._baseRepoLesson.findById(lessonId);
        if(!lesson){
            throw new Error(MESSAGES.COMPANY_LESSON_NOT_FOUND);
        }
        await this._baseRepoLesson.delete(lessonId);
    }
}