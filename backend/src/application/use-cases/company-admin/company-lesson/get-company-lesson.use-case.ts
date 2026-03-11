import { IGetCompanyLessonsUseCase } from "../../interfaces/companyAdmin/get-company-lessons.interface";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { mapLessonDTOforCompanyLesson } from "../../../mappers/companyAdmin/company-lesson.mapper";
import { CompanyLessonDTO } from "../../../DTOs/companyAdmin/company-lesson.dto";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";

export class GetCompanyLessonUseCase implements IGetCompanyLessonsUseCase {
  constructor(
    private lessonRepository: ILessonRepository,
    private userRepository: IUserRepository,
  ) { }
  async execute(userId: string): Promise<CompanyLessonDTO[]> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const companyId = user.CompanyId;
    const lessons = await this.lessonRepository.find({ companyId });
    if (!lessons.length) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.LESSON_NOT_FOUND);
    }

    return lessons.map((lesson) => mapLessonDTOforCompanyLesson(lesson));
  }
}
