import { LessonEntity } from "../../../entities/lesson.entity";
import { IBaseRepository } from "../base-repository.interface";
export interface ILessonRepository extends IBaseRepository<LessonEntity> {

  // CUSTOM
  getLessons(
    status: string,
    searchText: string,
    page: number,
    limit: number
  ): Promise<{ lessons: any[]; total: number }>;
}