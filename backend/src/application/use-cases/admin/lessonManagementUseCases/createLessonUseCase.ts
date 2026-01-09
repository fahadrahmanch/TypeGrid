import { LessonDTO } from "../../../DTOs/admin/lessonManagement.dto";
import { ICreateLessonUseCase } from "../../../../domain/interfaces/useCases/admin/ICreateLessonUseCase";
import { IBaseRepository } from "../../../../domain/interfaces/repository/user/IBaseRepository";
import { LessonEntity } from "../../../../domain/entities/admin/lesssonEntity";
import { mapLessonToDTO } from "../../../DTOs/admin/lessonManagement.dto";
export class createLessonUseCase implements ICreateLessonUseCase {
    constructor(
        private _baseRepositoryLesson:IBaseRepository<any>
    ){}
    async execute(lessonData: LessonDTO): Promise<void> {
        const lessonEntity = new LessonEntity(lessonData);
        await this._baseRepositoryLesson.create(lessonEntity);
    }

    async getLessons(): Promise<LessonDTO[]> {
        let lessons= await this._baseRepositoryLesson.find();
        return lessons.map((item)=>{
            return mapLessonToDTO(item);    
        })
        
    }   
}
