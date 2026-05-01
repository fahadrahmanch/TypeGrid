import { IAssignGroupLessonUseCase } from "../../interfaces/companyAdmin/assign-group-lesson.interface";
import { ILessonAssignmentRepository } from "../../../../domain/interfaces/repository/company/lesson-assignment-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { ICompanyGroupRepository } from "../../../../domain/interfaces/repository/company/company-group-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { LessonAssignmentEntity } from "../../../../domain/entities/assign-lesson.entity";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";

/**
 * Use case for assigning lessons to groups within a company.
 */
export class AssignGroupLessonUseCase implements IAssignGroupLessonUseCase {
  constructor(
    private _baseRepoAssignLesson: ILessonAssignmentRepository,
    private _userRepository: IUserRepository,
    private _groupRepository: ICompanyGroupRepository
  ) {}

  async execute(userId: string, groups: string[], lessons: string[], deadline: string): Promise<void> {
    const admin = await this._userRepository.findById(userId);
    if (!admin) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const companyId = admin.CompanyId;
    if (!companyId) {
      throw new CustomError(HttpStatusCodes.FORBIDDEN, MESSAGES.COMPANY_NOT_FOUND);
    }

    for (const groupId of groups) {
      const group = await this._groupRepository.findById(groupId);
      if (!group) continue;

      // Ensure members exist and is an array
      const members: string[] = group.members || [];
      
      for (const memberId of members) {
        for (const lessonId of lessons) {
          const assigned = new LessonAssignmentEntity({
            userId: memberId,
            lessonId: lessonId,
            status: "assigned",
            companyId: companyId,
            deadlineAt: new Date(deadline),
          });
          await this._baseRepoAssignLesson.create(assigned.toObject());
        }
      }
    }
  }
}
