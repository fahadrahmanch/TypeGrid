import { IGetAssignLessonUseCase } from "../interfaces/companyUser/get-assign-lesson.interface";
import { MESSAGES } from "../../../domain/constants/messages";
import { ILessonAssignmentRepository } from "../../../domain/interfaces/repository/company/lesson-assignment-repository.interface";
import { ILessonRepository } from "../../../domain/interfaces/repository/admin/lesson-repository.interface";
import { AssignedLessonDTO } from "../../DTOs/companyUser/get-assign-lesson-response.dto";

export class GetAssignLessonUseCase implements IGetAssignLessonUseCase {
  constructor(
    private _baseAssignmentLessonRepository: ILessonAssignmentRepository,
  ) {}

  async execute(assignmentId: string): Promise<AssignedLessonDTO> {
    const assignedLesson = await this._baseAssignmentLessonRepository.findById(
      assignmentId,
      { populate: { path: "lessonId" } },
    );

    if (!assignedLesson) {
      throw new Error(MESSAGES.ASSIGNED_LESSON_NOT_FOUND);
    }
    return {
      id: assignedLesson._id.toString(),
      status: assignedLesson.status,
      deadlineAt: assignedLesson.deadlineAt,

      lesson: {
        id: assignedLesson.lessonId._id.toString(),
        title: assignedLesson.lessonId.title,
        text: assignedLesson.lessonId.text,
        level: assignedLesson.lessonId.level,
        wpm: assignedLesson.lessonId.wpm,
        accuracy: assignedLesson.lessonId.accuracy,
      },
    };
  }
}
