import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { IDeleteLessonUseCase } from "../../interfaces/admin/delete-lesson.interface";
export class DeleteLessonUseCase implements IDeleteLessonUseCase {
  constructor(private lessonRepository: ILessonRepository) {}
  async execute(lessonId: string): Promise<void> {
    const lesson = await this.lessonRepository.findById(lessonId);
    if (!lesson) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.LESSON_NOT_FOUND,
      );
    }
    await this.lessonRepository.delete(lessonId);
  }
}
