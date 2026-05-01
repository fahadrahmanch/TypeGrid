import { LessonDTO } from "../../../DTOs/admin/lesson-management.dto";
import { ICreateLessonUseCase } from "../../interfaces/admin/create-lesson.interface";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
import { LessonEntity } from "../../../../domain/entities/lesson.entity";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { MESSAGES } from "../../../../domain/constants/messages";
export class CreateLessonUseCase implements ICreateLessonUseCase {
  constructor(private readonly _lessonRepository: ILessonRepository) {}
  /**
   * Executes the create lesson use case.
   * @param lessonData - The lesson data transfer object containing lesson information to be created.
   * @throws {CustomError} Throws a CustomError with BAD_REQUEST status if lessonData is invalid or not provided.
   */
  async execute(lessonData: LessonDTO): Promise<void> {
    if (!lessonData) {
      throw new CustomError(HttpStatusCodes.BAD_REQUEST, MESSAGES.INVALID_REQUEST);
    }
    const lessonEntityInstance = new LessonEntity(lessonData);
    await this._lessonRepository.create(lessonEntityInstance);
  }
}
