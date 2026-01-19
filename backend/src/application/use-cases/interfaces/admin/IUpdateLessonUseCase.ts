import { LessonDTO } from "../../../DTOs/admin/lessonManagement.dto"
export interface IUpdateLessonUseCase{
    execute(lessonId:string,values:any):Promise<LessonDTO>
}