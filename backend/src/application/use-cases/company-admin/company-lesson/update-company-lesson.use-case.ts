import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
import { IUpdateCompanyLessonUseCase } from "../../interfaces/companyAdmin/update-company-lesson.interface";
import { CompanyLessonDTO } from "../../../DTOs/companyAdmin/company-lesson.dto";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { mapLessonDTOforCompanyLesson } from "../../../mappers/companyAdmin/company-lesson.mapper";
/**
 * Use case responsible for updating a lesson belonging to a company.
 */
export class UpdateCompanyLessonUseCase implements IUpdateCompanyLessonUseCase {
  constructor(private readonly _lessonRepository: ILessonRepository) {}

  async execute(lessonId: string, lessonData: Partial<CompanyLessonDTO>): Promise<CompanyLessonDTO> {
    if (!lessonId || !lessonData) {
      throw new CustomError(HttpStatusCodes.BAD_REQUEST, MESSAGES.INVALID_REQUEST);
    }

    const lesson = await this._lessonRepository.findById(lessonId);

    if (!lesson) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.COMPANY_LESSON_NOT_FOUND);
    }

    const updatedEntity = {
      ...lesson,
      ...lessonData,
    };

    const updatedLesson = await this._lessonRepository.update(updatedEntity);

    if (!updatedLesson) {
      throw new CustomError(HttpStatusCodes.INTERNAL_SERVER_ERROR, MESSAGES.LESSON_UPDATE_FAILED);
    }

    return mapLessonDTOforCompanyLesson(updatedLesson);
  }
}
