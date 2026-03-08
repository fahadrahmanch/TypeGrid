import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/ILessonRepository";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/customError";
import { HttpStatusCodes } from "../../../../domain/enums/httpStatusCodes";
import { IDeleteLessonUseCase } from "../../interfaces/admin/IDeleteLessonUseCase";
export class deleteLessonUseCase implements IDeleteLessonUseCase {
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
