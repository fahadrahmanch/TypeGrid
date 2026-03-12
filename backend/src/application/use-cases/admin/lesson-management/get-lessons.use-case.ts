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
  async execute(): Promise<LessonDTO[]> {

    const lessons = await this._lessonRepository.find({ createdBy: "admin" });

    return lessons.map(mapLessonToDTO);

  }

}