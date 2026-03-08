import { IGetMyLessonsUseCase } from "../interfaces/companyUser/IGetMyLessonsUseCase";
import { ILessonAssignmentRepository } from "../../../domain/interfaces/repository/company/ILessonAssignmentRepository";
import { IUserRepository } from "../../../domain/interfaces/repository/user/IUserRepository";
import { ILessonRepository } from "../../../domain/interfaces/repository/admin/ILessonRepository";
import { MESSAGES } from "../../../domain/constants/messages";
import { GetMyLessonsResponseDTO } from "../../DTOs/companyUser/GetMyLessonsResponseDTO";
export class getMyLessonsUseCase implements IGetMyLessonsUseCase {
  constructor(
    private _baseAssignmentLessonRepository: ILessonAssignmentRepository,
    private userRepository: IUserRepository,
    private lessonRepository: ILessonRepository,
  ) {}
  async execute(userId: string): Promise<GetMyLessonsResponseDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
    }

    const assignedLessons = await this._baseAssignmentLessonRepository.find(
      { userId },
      {
        populate: {
          path: "lessonId",
          select: "text wpm accuracy level title category createdBy",
        },
      },
    );
    const completed = assignedLessons.reduce((acc, curr) => {
      if (curr.status === "completed") {
        return acc + 1;
      }
      return acc;
    }, 0);
    return {
      lessons: assignedLessons,
      completed,
      total: assignedLessons.length,
    };
  }
}
