import { IDeleteLessonUseCase } from "../../interfaces/admin/IDeleteLessonUseCase";
import {IBaseRepository} from "../../../../domain/interfaces/repository/IBaseRepository";
export class deleteLessonUseCase implements IDeleteLessonUseCase{
    constructor(private _baseRepositoryLesson:IBaseRepository<any>){}
    async execute(lessonId:string):Promise<void>{
        const lesson=await this._baseRepositoryLesson.findById(lessonId);
        if(!lesson){
            throw new Error("Lesson not found");
        }
        await this._baseRepositoryLesson.delete(lessonId);
    }
}