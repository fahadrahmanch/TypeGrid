import { IGetMyLessonsUseCase } from "../../interfaces/companyUser/get-my-lessons.interface";
import { ILessonAssignmentRepository } from "../../../../domain/interfaces/repository/company/lesson-assignment-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { GetMyLessonsResponseDTO } from "../../../DTOs/companyUser/get-my-lessons-response.dto";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
export class GetMyLessonsUseCase implements IGetMyLessonsUseCase {
  constructor(
    private _baseAssignmentLessonRepository: ILessonAssignmentRepository,
    private userRepository: IUserRepository,
  ) { }
  async execute(userId: string): Promise<GetMyLessonsResponseDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
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
