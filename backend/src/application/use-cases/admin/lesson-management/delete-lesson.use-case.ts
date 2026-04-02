import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { IDeleteLessonUseCase } from "../../interfaces/admin/delete-lesson.interface";

/**
 * Use case responsible for deleting a lesson.
 */
export class DeleteLessonUseCase implements IDeleteLessonUseCase {
  constructor(private readonly _lessonRepository: ILessonRepository) {}

  /**
   * Deletes a lesson by its ID.
   * @param lessonId - The ID of the lesson to delete.
   * @throws {CustomError} If the lesson does not exist.
   */
  async execute(lessonId: string): Promise<void> {
    const lesson = await this._lessonRepository.findById(lessonId);

    if (!lesson) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.LESSON_NOT_FOUND,
      );
    }

    await this._lessonRepository.delete(lessonId);
  }
}
