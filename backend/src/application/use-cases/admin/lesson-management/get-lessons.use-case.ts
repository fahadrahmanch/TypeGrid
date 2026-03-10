import { IGetLessonsUseCase } from "../../interfaces/admin/get-lessons.interface";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
import { LessonDTO } from "../../../DTOs/admin/lesson-management.dto";
import { mapLessonToDTO } from "../../../mappers/admin/lesson-management.mapper";

export class GetLessonsUseCase implements IGetLessonsUseCase {
 
  constructor(private _lessonRepo: ILessonRepository) { }

  async execute(): Promise<LessonDTO[]> {
    const lessons = await this._lessonRepo.find({createdBy:'admin'});
    return lessons.map((item) => mapLessonToDTO(item))
  }

}