import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
import { CompanyLessonDTO } from "../../../DTOs/companyAdmin/company-lesson.dto";
import { IGetAdminLessonsUseCase } from "../../interfaces/companyAdmin/get-admin-lesson.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { mapLessonDTOforCompanyLesson } from "../../../mappers/companyAdmin/company-lesson.mapper";

/**
 * Use case for retrieving admin-created lessons for company access.
 */
export class GetAdminLessonUseCase implements IGetAdminLessonsUseCase {
  constructor(private readonly _lessonRepo: ILessonRepository) {}
  async execute(): Promise<CompanyLessonDTO[]> {
    const lessons = await this._lessonRepo.find({ createdBy: "admin" });
    if (!lessons) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.LESSON_NOT_FOUND);
    }
    const lessonDTOs = lessons.map(mapLessonDTOforCompanyLesson);
    return lessonDTOs;
  }
}
