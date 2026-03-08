import { IGetLessonUseCase } from "../../interfaces/companyAdmin/IGetLessonUseCase";
import { CompanyLessonDTO } from "../../../DTOs/companyAdmin/companyLessonDTO";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/customError";
import { HttpStatusCodes } from "../../../../domain/enums/httpStatusCodes";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/ILessonRepository";
import { mapLessonDTOforCompanyLesson } from "../../../DTOs/companyAdmin/companyLessonDTO";
export class getLessonUseCase implements IGetLessonUseCase {
  constructor(private BaseRepoLessonL: ILessonRepository) {}
  async execute(lessonId: string): Promise<CompanyLessonDTO> {
    if (!lessonId) {
      throw new CustomError(
        HttpStatusCodes.BAD_REQUEST,
        MESSAGES.LESSON_ID_REQUIRED,
      );
    }
    const lesson = await this.BaseRepoLessonL.findById(lessonId);
    if (!lesson) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.LESSON_NOT_FOUND,
      );
    }
    return mapLessonDTOforCompanyLesson(lesson);
  }
}
