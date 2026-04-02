import { ICreateCompanyLessonUseCase } from "../../interfaces/companyAdmin/create-company-lesson.interface";
import { CompanyLessonDTO } from "../../../DTOs/companyAdmin/company-lesson.dto";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { LessonEntity } from "../../../../domain/entities/lesson.entity";
import { mapLessonDTOforCompanyLesson } from "../../../mappers/companyAdmin/company-lesson.mapper";
/**
 * Use case for creating a company lesson.
 *
 * Handles the creation of a new lesson for a company by validating the requesting user
 */
export class CreateCompanyLessonUseCase implements ICreateCompanyLessonUseCase {
  constructor(
    private readonly _lessonRepository: ILessonRepository,
    private readonly _userRepository: IUserRepository,
  ) {}
  async execute(
    userId: string,
    data: Partial<CompanyLessonDTO>,
  ): Promise<CompanyLessonDTO> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.AUTH_USER_NOT_FOUND,
      );
    }
    if (user.role != "companyAdmin") {
      throw new CustomError(
        HttpStatusCodes.UNAUTHORIZED,
        MESSAGES.UNAUTHORIZED,
      );
    }
    const companyId = user.CompanyId;
    if (!companyId) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.INVALID_COMPANY_REFERENCE,
      );
    }
    const lesson = new LessonEntity({
      ...data,
      companyId,
      createdBy: "company",
    });
    const createdLesson = await this._lessonRepository.create(lesson);
    return mapLessonDTOforCompanyLesson(createdLesson);
  }
}
