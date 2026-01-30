import { IGetAssignLessonUseCase } from "../interfaces/companyUser/IGetAssignLessonUseCase";
import { IBaseRepository } from "../../../domain/interfaces/repository/IBaseRepository";
import { AssignedLessonDTO } from "../../DTOs/companyUser/GetAssignLessonResponseDTO";

export class getAssignLessonUseCase implements IGetAssignLessonUseCase {
  constructor(
    private _baseAssignmentLessonRepository: IBaseRepository<any>
  ) {}

  async execute(assignmentId: string): Promise<AssignedLessonDTO> {

    const assignedLesson =
      await this._baseAssignmentLessonRepository.findById(
        assignmentId,
        { populate: { path: "lessonId" } }
      );

    if (!assignedLesson) {
      throw new Error("Assigned lesson not found");
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
      }
    };
  }
}
