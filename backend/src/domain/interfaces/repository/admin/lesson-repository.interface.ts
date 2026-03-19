import { LessonEntity } from "../../../entities/lesson.entity";

export interface ILessonRepository {

  // CREATE
  create(data: any): Promise<LessonEntity>;

  // READ
  findById(
    id: string,
    options?: {
      populate?: { path: string; select?: string };
    }
  ): Promise<LessonEntity | null>;

  find(
    filter?: any,
    options?: {
      populate?: { path: string; select?: string };
    }
  ): Promise<LessonEntity[]>;

  findOne(filter?: any): Promise<LessonEntity | null>;

  // UPDATE
  updateById(
    id: string,
    update: any
  ): Promise<LessonEntity | null>;

  // DELETE
  delete(id: string): Promise<LessonEntity | null>;
  update(data: any): Promise<LessonEntity | null>;

  // CUSTOM
  getLessons(
    status: string,
    searchText: string,
    page: number,
    limit: number
  ): Promise<{ lessons: any[]; total: number }>;
}