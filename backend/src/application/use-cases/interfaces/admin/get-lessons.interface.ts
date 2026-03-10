import { LessonDTO } from "../../../DTOs/admin/lesson-management.dto";
export interface IGetLessonsUseCase {
  execute(): Promise<LessonDTO[]>;
}
