import { LessonDTO } from "../../../DTOs/admin/lesson-management.dto";
export interface IUpdateLessonUseCase {
  execute(lessonId: string, values: any): Promise<LessonDTO>;
}
