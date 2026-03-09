import { IGetCompanyLessonsUseCase } from "../../interfaces/companyAdmin/get-company-lessons.interface";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { mapLessonDTOforCompanyLesson } from "../../../../application/mappers/companyAdmin/company-lesson.mapper";
import { CompanyLessonDTO } from "../../../../application/DTOs/companyAdmin/company-lesson.dto";
export class GetCompanyLessonUseCase implements IGetCompanyLessonsUseCase {
  constructor(
    private lessonRepository: ILessonRepository,
    private userRepository: IUserRepository,
  ) {}
  async execute(userId: string): Promise<CompanyLessonDTO[]> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const companyId = user.CompanyId;
    const lessons = await this.lessonRepository.find({ companyId });
    if (!lessons.length) {
      throw new Error(MESSAGES.LESSON_NOT_FOUND);
    }

    return lessons.map((lesson) => mapLessonDTOforCompanyLesson(lesson));
  }
}
