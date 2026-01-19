
import { LessonDTO } from "../../../DTOs/admin/lessonManagement.dto"
export interface IGetLessonUseCase{
    execute(lessonId:string):Promise<LessonDTO>
}