import { IGetLessonsUseCase } from "../../interfaces/admin/get-lessons.interface";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
import { LessonDTO } from "../../../DTOs/admin/lesson-management.dto";
import { mapLessonToDTO } from "../../../mappers/admin/lesson-management.mapper";

/**
 * Use case responsible for retrieving lessons created by the admin.
 */
export class GetLessonsUseCase implements IGetLessonsUseCase {
  constructor(private readonly _lessonRepository: ILessonRepository) {}

  /**
   * Retrieves all lessons created by the admin.
   */
  async execute(
    status: string,
    searchText: string,
    page: number,
    limit: number
  ): Promise<{ lessons: LessonDTO[]; total: number }> {
    const lessons = await this._lessonRepository.getLessons(status, searchText, page, limit);

    return {
      lessons: lessons.lessons.map(mapLessonToDTO),
      total: lessons.total,
    };
  }
}
