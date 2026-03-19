import { ISaveLessonResultUseCase } from "../../interfaces/companyUser/save-lesson-result.interface";
import { ILessonAssignmentRepository } from "../../../../domain/interfaces/repository/company/lesson-assignment-repository.interface";
import { ILessonResultRepository } from "../../../../domain/interfaces/repository/company/lesson-result-repository.interface";
import { LessonResult } from "../../../../domain/entities/lesson-result.entity";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import logger from "../../../../utils/logger";
import { LessonResultDTO } from "../../../DTOs/companyUser/lesson-result.dto";


export class SaveLessonResultUseCase implements ISaveLessonResultUseCase {
  constructor(
    private readonly _lessonResultRepository: ILessonResultRepository,
    private readonly _lessonAssignmentRepository: ILessonAssignmentRepository
  ) {}

  async execute(
    userId: string,
    assignmentId: string,
    result: LessonResultDTO
  ): Promise<void> {
    const assignment = await this._lessonAssignmentRepository.findById(assignmentId);

    if (!assignment) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.ASSIGNED_LESSON_NOT_FOUND
      );
    }

    const status = result?.status === "progress" ? "progress" : "completed";

    const { status: _ignored, ...metrics } = result;

    const existingResult = await this._lessonResultRepository.findOne({
      userId,
      assignmentId,
    });

    const lessonResult = new LessonResult({
      userId,
      assignmentId,
      companyId: assignment.getCompanyId(),
      lessonId: assignment.getLessonId(),
      status,
      ...metrics,
    });

    if (!existingResult) {
      const created = await this._lessonResultRepository.create(lessonResult);

      if (!created) {
        throw new CustomError(
          HttpStatusCodes.INTERNAL_SERVER_ERROR,
          MESSAGES.LESSON_RESULT_SAVE_FAILED
        );
      }
    } else {

      if (assignment.getStatus() === "completed") {
        logger.info("Lesson already completed");
        return;
      }

      const updated = await this._lessonResultRepository.update(lessonResult);

      if (!updated) {
        throw new CustomError(
          HttpStatusCodes.INTERNAL_SERVER_ERROR,
          MESSAGES.LESSON_RESULT_SAVE_FAILED
        );
      }
    }

    await this._lessonAssignmentRepository.update({
      _id: assignmentId,
      status,
    });
  }
}