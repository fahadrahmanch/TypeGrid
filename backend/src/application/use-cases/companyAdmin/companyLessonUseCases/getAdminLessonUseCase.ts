import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/ILessonRepository";
import { CompanyLessonDTO } from "../../../DTOs/companyAdmin/companyLessonDTO";
import { IGetAdminLessonsUseCase } from "../../interfaces/companyAdmin/IGetAdminLessonUseCase";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/customError";
import { HttpStatusCodes } from "../../../../domain/enums/httpStatusCodes";
import { mapLessonDTOforCompanyLesson } from "../../../DTOs/companyAdmin/companyLessonDTO";
export class getAdminLessonsUseCase implements IGetAdminLessonsUseCase {
  constructor(private _lessonRepo: ILessonRepository) {}
  async execute(): Promise<CompanyLessonDTO[]> {
    const lessons = await this._lessonRepo.find({ createdBy: "admin" });
    if (!lessons) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.LESSON_NOT_FOUND,
      );
    }
    const lessonDTOs = lessons.map(mapLessonDTOforCompanyLesson);
    return lessonDTOs;
  }
}
