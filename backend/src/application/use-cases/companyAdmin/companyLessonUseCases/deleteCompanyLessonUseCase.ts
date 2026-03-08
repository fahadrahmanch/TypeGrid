import { IDeleteCompanyLessonUseCase } from "../../interfaces/companyAdmin/IDeleteCompanyLessonUseCase";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/customError";
import { HttpStatusCodes } from "../../../../domain/enums/httpStatusCodes";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/ILessonRepository";
export class deleteCompanyLessonUseCase implements IDeleteCompanyLessonUseCase {
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
