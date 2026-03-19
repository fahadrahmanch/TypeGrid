import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { IUpdateLessonUseCase } from "../../interfaces/admin/update-lesson.interface";
import { LessonDTO } from "../../../DTOs/admin/lesson-management.dto";
import { mapLessonToDTO } from "../../../mappers/admin/lesson-management.mapper";

/**
 * Use case responsible for updating a lesson.
 */
export class UpdateLessonUseCase implements IUpdateLessonUseCase {

  constructor(private readonly _lessonRepository: ILessonRepository) {}

  /**
   * Updates a lesson with the given values.
   *
   * @param lessonId - The unique identifier of the lesson to update.
   * @param values - Partial lesson data to update.
   * @returns A promise that resolves to the updated lesson as a LessonDTO.
   * @throws CustomError if the lesson is not found.
   */
  async execute(lessonId: string, values: Partial<LessonDTO>): Promise<LessonDTO> {

    const lesson = await this._lessonRepository.findById(lessonId);

    if (!lesson) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.LESSON_NOT_FOUND
      );
    }

    const updatedLesson = await this._lessonRepository.update({
      _id: lessonId,
      ...values
    });

    return mapLessonToDTO(updatedLesson!);
  }

}