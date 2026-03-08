import { IDeleteCompanyLessonUseCase } from "../../interfaces/companyAdmin/delete-company-lesson.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
export class DeleteCompanyLessonUseCase implements IDeleteCompanyLessonUseCase {
  constructor(private lessonRepository: ILessonRepository) {}
  async execute(lessonId: string): Promise<void> {
    const lesson = await this.lessonRepository.findById(lessonId);
    if (!lesson) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.COMPANY_LESSON_NOT_FOUND,
      );
    }
    await this.lessonRepository.delete(lessonId);
  }
}
