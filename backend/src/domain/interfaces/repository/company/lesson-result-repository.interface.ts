import { IBaseRepository } from "../base-repository.interface";

export interface ILessonResultRepository extends IBaseRepository<any> {
  countCompletedLessons(userId: string): Promise<number>;
}
