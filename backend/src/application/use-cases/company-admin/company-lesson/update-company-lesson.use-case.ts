import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
import { IUpdateCompanyLessonUseCase } from "../../interfaces/companyAdmin/update-company-lesson.interface";
import { CompanyLessonDTO } from "../../../DTOs/companyAdmin/company-lesson.dto";
import { LessonEntity } from "../../../../domain/entities/lesson.entity";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { mapLessonDTOforCompanyLesson } from "../../../mappers/companyAdmin/company-lesson.mapper";
export class UpdateCompanyLessonUseCase implements IUpdateCompanyLessonUseCase {
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

    const LessonEntity = lesson;
    Object.assign(LessonEntity, lessonData);
    const updatedLesson = await this.lessonRepository.update(LessonEntity);
    return mapLessonDTOforCompanyLesson(updatedLesson);
  }
}
