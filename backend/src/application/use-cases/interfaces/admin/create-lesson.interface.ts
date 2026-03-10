import { LessonDTO } from "../../../../application/DTOs/admin/lesson-management.dto";

export interface ICreateLessonUseCase {
  execute(lessonData: any): Promise<void>;

}
