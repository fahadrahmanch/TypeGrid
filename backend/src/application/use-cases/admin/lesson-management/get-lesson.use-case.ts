import { IGetLessonUseCase } from "../../interfaces/admin/get-lesson.interface";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { LessonDTO } from "../../../DTOs/admin/lesson-management.dto";
import { mapLessonToDTO } from "../../../mappers/admin/lesson-management.mapper";

/**
 * Use case responsible for retrieving a lesson by ID.
 */
export class GetLessonUseCase implements IGetLessonUseCase {
  constructor(private readonly _lessonRepository: ILessonRepository) {}

  /**
   * Retrieves a lesson by its ID.
   * @param lessonId - The ID of the lesson to retrieve.
   */
  async execute(lessonId: string): Promise<LessonDTO> {
    const lesson = await this._lessonRepository.findById(lessonId);

    if (!lesson) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.LESSON_NOT_FOUND,
      );
    }

    return mapLessonToDTO(lesson);
  }
}
