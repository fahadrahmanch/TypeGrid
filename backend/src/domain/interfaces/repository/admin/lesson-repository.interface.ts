import { LessonEntity } from "../../../entities/lesson.entity";

export interface ILessonRepository {

  // CREATE
  create(data: any): Promise<any>;

  // READ
  findById(
    id: string,
    options?: {
      populate?: { path: string; select?: string };
    }
  ): Promise< any>;

  find(
    filter?: any,
    options?: {
      populate?: { path: string; select?: string };
    }
  ): Promise<any>;

  findOne(filter?: any): Promise<any>;

  // UPDATE
  updateById(
    id: string,
    update: any
  ): Promise<any>;

  // DELETE
  delete(id: string): Promise<any>;
  update(data: any): Promise<any>;

  // CUSTOM
  getLessons(
    status: string,
    searchText: string,
    page: number,
    limit: number
  ): Promise<{ lessons: any[]; total: number }>;
}