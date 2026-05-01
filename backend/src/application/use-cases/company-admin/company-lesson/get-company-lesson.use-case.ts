import { IGetCompanyLessonsUseCase } from "../../interfaces/companyAdmin/get-company-lessons.interface";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { mapLessonDTOforCompanyLesson } from "../../../mappers/companyAdmin/company-lesson.mapper";
import { CompanyLessonDTO } from "../../../DTOs/companyAdmin/company-lesson.dto";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";

/**
 * Use case responsible for retrieving all lessons belonging to a company.
 * Resolves the company context from the requesting user's profile.
 */
export class GetCompanyLessonsUseCase implements IGetCompanyLessonsUseCase {
  constructor(
    private readonly _lessonRepository: ILessonRepository,
    private readonly _userRepository: IUserRepository
  ) {}

  async execute(userId: string): Promise<CompanyLessonDTO[]> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }

    const companyId = user.CompanyId;
    if (!companyId) {
      throw new CustomError(HttpStatusCodes.FORBIDDEN, MESSAGES.COMPANY_NOT_FOUND);
    }

    const lessons = await this._lessonRepository.find({ companyId });

    return lessons.map((lesson: any) => mapLessonDTOforCompanyLesson(lesson));
  }
}
