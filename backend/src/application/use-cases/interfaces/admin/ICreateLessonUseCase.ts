import { LessonDTO } from "../../../../application/DTOs/admin/lessonManagement.dto";

export interface ICreateLessonUseCase {
  execute(lessonData: any): Promise<void>;
  getLessons(): Promise<LessonDTO[]>;
}
