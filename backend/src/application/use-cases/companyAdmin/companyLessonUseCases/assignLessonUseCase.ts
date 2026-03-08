import { IAssignLessonUseCase } from "../../interfaces/companyAdmin/IAssignLessonUseCase";
import { ILessonAssignmentRepository } from "../../../../domain/interfaces/repository/company/ILessonAssignmentRepository";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/IUserRepository";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/ILessonRepository";
import { MESSAGES } from "../../../../domain/constants/messages";
import { LessonAssignment } from "../../../../infrastructure/db/models/company/lesssonAssigmentSchema";
export class assignLessonUseCase implements IAssignLessonUseCase {
  constructor(
    private _baseRepoAssignLesson: ILessonAssignmentRepository,
    private userRepository: IUserRepository,
    private _baseRepoLeson: ILessonRepository,
  ) {}
  async execute(
    userId: string,
    users: string[],
    lessons: string[],
    deadline: string,
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const companyId = user.CompanyId;
    if (!companyId) {
      throw new Error(MESSAGES.COMPANY_NOT_FOUND);
    }
    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < lessons.length; j++) {
        const assigned = new LessonAssignment({
          userId: users[i],
          lessonId: lessons[j],
          status: "assigned",
          companyId: companyId,
          deadlineAt: deadline,
        });
        await this._baseRepoAssignLesson.create(assigned);
      }
    }
  }
}
