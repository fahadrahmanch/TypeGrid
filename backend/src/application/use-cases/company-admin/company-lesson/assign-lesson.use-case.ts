import { IAssignLessonUseCase } from "../../interfaces/companyAdmin/assign-lesson.interface";
import { ILessonAssignmentRepository } from "../../../../domain/interfaces/repository/company/lesson-assignment-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { LessonAssignmentEntity } from "../../../../domain/entities/assign-lesson.entity";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";

/**
 * Use case for assigning lessons to multiple users within a company.
 */
export class AssignLessonUseCase implements IAssignLessonUseCase {
  constructor(
    private _baseRepoAssignLesson: ILessonAssignmentRepository,
    private _userRepository: IUserRepository,
  ) {}
  async execute(
    userId: string,
    users: string[],
    lessons: string[],
    deadline: string,
  ): Promise<void> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const companyId = user.CompanyId;
    if (!companyId) {
      throw new CustomError(HttpStatusCodes.FORBIDDEN, MESSAGES.COMPANY_NOT_FOUND);
    }
    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < lessons.length; j++) {
        const assigned = new LessonAssignmentEntity({
          userId: users[i],
          lessonId: lessons[j],
          status: "assigned",
          companyId: companyId,
          deadlineAt: new Date(deadline)
        });
        await this._baseRepoAssignLesson.create(assigned.toObject());
      }
    }
  }
}
