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
    private _userRepository: IUserRepository,
    private _lessonRepository: ILessonRepository,
  ) { }
  async execute(userId: string): Promise<GetMyLessonsResponseDTO> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }
    console.log("user",user)
    console.log("userId",userId)

    const assignedLessons = await this._baseAssignmentLessonRepository.find(
      { userId },
    );
    console.log("assignedLessons",assignedLessons)
    const lessons = await Promise.all(
      assignedLessons.map(async (assignedLesson) => {
        const lesson = await this._lessonRepository.findById(assignedLesson.getLessonId());
        return {
          assignmentId: assignedLesson.getId(),
          status: assignedLesson.getStatus(),
          deadlineAt: assignedLesson.getDeadlineAt(),
          assignedAt: assignedLesson.getAssignedAt(),
          lesson: lesson ? {
            id: lesson._id,
            text: lesson.text,
            wpm: lesson.wpm,
            accuracy: lesson.accuracy,
            level: lesson.level,
            title: lesson.title,
            category: lesson.category,
            createdBy: lesson.createdBy,
          } : null
        };
      })
    );

    const completed = assignedLessons.reduce((acc, curr) => {
      if (curr.getStatus() === "completed") {
        return acc + 1;
      }
      return acc;
    }, 0);
    return {
      lessons: lessons,
      completed,
      total: assignedLessons.length,
    };
  }
}
