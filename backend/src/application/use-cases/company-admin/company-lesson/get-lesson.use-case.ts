import { IGetLessonUseCase } from "../../interfaces/companyAdmin/get-lesson.interface";
import { CompanyLessonDTO } from "../../../DTOs/companyAdmin/company-lesson.dto";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
import { mapLessonDTOforCompanyLesson } from "../../../mappers/companyAdmin/company-lesson.mapper";
/**
 * Use case for retrieving a lesson by its ID.
 */
export class GetLessonUseCase implements IGetLessonUseCase {
  constructor(private readonly _baseRepoLesson: ILessonRepository) {}
  async execute(lessonId: string): Promise<CompanyLessonDTO> {
    if (!lessonId) {
      throw new CustomError(HttpStatusCodes.BAD_REQUEST, MESSAGES.LESSON_ID_REQUIRED);
    }
    const lesson = await this._baseRepoLesson.findById(lessonId);
    if (!lesson) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.LESSON_NOT_FOUND);
    }
    return mapLessonDTOforCompanyLesson(lesson);
  }
}
