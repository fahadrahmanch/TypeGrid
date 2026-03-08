import { LessonDTO } from "../../../DTOs/admin/lesson-management.dto";
export interface IGetLessonUseCase {
  execute(lessonId: string): Promise<LessonDTO>;
}
