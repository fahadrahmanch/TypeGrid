import { ISaveLessonResultUseCase } from "../../interfaces/companyUser/save-lesson-result.interface";
import { ILessonAssignmentRepository } from "../../../../domain/interfaces/repository/company/lesson-assignment-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { ILessonResultRepository } from "../../../../domain/interfaces/repository/company/lesson-result-repository.interface";
import { LessonResult } from "../../../../domain/entities/lesson-result.entity";
import logger from "../../../../utils/logger";
export class SaveLessonResultUseCase implements ISaveLessonResultUseCase {
  constructor(
    private lessonRepositoryResult: ILessonResultRepository,
    private lessonRepositoryAssignment: ILessonAssignmentRepository,
  ) {}
  async execute(
    userId: string,
    assignmentId: string,
    result: any,
  ): Promise<void> {
    const assignmentLesson =
      await this.lessonRepositoryAssignment.findById(assignmentId);
    const status = result?.status == false ? "progress" : "completed";
    const { status: _ignored, ...safeResult } = result;
    if (!assignmentLesson) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.ASSIGNED_LESSON_NOT_FOUND,
      );
    }
    const existingResult = await this.lessonRepositoryResult.findOne({
      userId,
      assignmentId,
    });

    if (!existingResult) {
      const lessonResult = new LessonResult({
        userId,
        assignmentId,
        companyId: assignmentLesson.companyId,
        lessonId: assignmentLesson.lessonId,
        status,
        ...safeResult,
      });
      const saveResult = await this.lessonRepositoryResult.create(lessonResult);
      if (!saveResult) {
        throw new CustomError(
          HttpStatusCodes.INTERNAL_SERVER_ERROR,
          MESSAGES.LESSON_RESULT_SAVE_FAILED,
        );
      }
      return;
    }
    if (assignmentLesson.status === "completed") {
      logger.info("already completed");
      return;
    }
    const lessonResult = new LessonResult({
      userId,
      assignmentId,
      companyId: assignmentLesson.companyId,
      lessonId: assignmentLesson.lessonId,
      status: status,
      ...safeResult,
    });
    await this.lessonRepositoryAssignment.updateById(assignmentId, {
      status: status,
    });
    const saveResult = await this.lessonRepositoryResult.update(lessonResult);
    if (!saveResult) {
      throw new CustomError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to save lesson result",
      );
    }
  }
}
