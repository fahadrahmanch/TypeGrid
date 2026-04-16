import { LessonDTO } from '../../../DTOs/admin/lesson-management.dto';
export interface IGetLessonsUseCase {
  execute(
    status: string,
    searchText: string,
    page: number,
    limit: number
  ): Promise<{ lessons: LessonDTO[]; total: number }>;
}
