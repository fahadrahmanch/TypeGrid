import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/ILessonRepository";
import { IUpdateCompanyLessonUseCase } from "../../interfaces/companyAdmin/IUpdateCompanyLessonUseCase";
import { CompanyLessonDTO } from "../../../DTOs/companyAdmin/companyLessonDTO";
import { LessonEntity } from "../../../../domain/entities/LessonEntity";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/customError";
import { HttpStatusCodes } from "../../../../domain/enums/httpStatusCodes";
import { mapLessonDTOforCompanyLesson } from "../../../DTOs/companyAdmin/companyLessonDTO";
export class updateCompanyLessonUseCase implements IUpdateCompanyLessonUseCase {
  constructor(private lessonRepository: ILessonRepository) {}
  async execute(
    lessonId: string,
    lessonData: CompanyLessonDTO,
  ): Promise<CompanyLessonDTO> {
    if (!lessonId || !lessonData) {
      throw new CustomError(
        HttpStatusCodes.BAD_REQUEST,
        MESSAGES.INVALID_REQUEST,
      );
    }
    const lesson = await this.lessonRepository.findById(lessonId);
    if (!lesson) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.COMPANY_LESSON_NOT_FOUND,
      );
    }

    const lessonEntity = lesson;
    Object.assign(lessonEntity, lessonData);
    const updatedLesson = await this.lessonRepository.update(lessonEntity);
    return mapLessonDTOforCompanyLesson(updatedLesson as any);
  }
}
