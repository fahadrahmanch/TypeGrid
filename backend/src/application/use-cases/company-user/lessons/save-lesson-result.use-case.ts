import { ISaveLessonResultUseCase } from "../../interfaces/companyUser/save-lesson-result.interface";
import { ILessonAssignmentRepository } from "../../../../domain/interfaces/repository/company/lesson-assignment-repository.interface";
import { ILessonResultRepository } from "../../../../domain/interfaces/repository/company/lesson-result-repository.interface";
import { LessonResult } from "../../../../domain/entities/lesson-result.entity";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import logger from "../../../../utils/logger";
import { LessonResultDTO } from "../../../DTOs/companyUser/lesson-result.dto";
import { ICompanyUserStatsRepository } from "../../../../domain/interfaces/repository/company/company-user-stats-repository.interface";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
import { updateCompanyUserStats } from "../../../services/company-user-stats.service";

export class SaveLessonResultUseCase implements ISaveLessonResultUseCase {
  constructor(
    private readonly _lessonResultRepository: ILessonResultRepository,
    private readonly _lessonAssignmentRepository: ILessonAssignmentRepository,
    private readonly _lessonRepository: ILessonRepository,
    private readonly _statsRepository: ICompanyUserStatsRepository,
  ) {}

  async execute(
    userId: string,
    assignmentId: string,
    result: LessonResultDTO,
  ): Promise<void> {
    const assignment =
      await this._lessonAssignmentRepository.findById(assignmentId);
    if (!assignment) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.ASSIGNED_LESSON_NOT_FOUND,
      );
    }

    const status = result?.status === "progress" ? "progress" : "completed";
    const { status: _ignored, ...metrics } = result;
    const existingResult = await this._lessonResultRepository.findOne({
      userId,
      assignmentId,
    });

    const lessonResult = new LessonResult({
      _id: existingResult?.getId(),
      userId,
      assignmentId,
      companyId: assignment.getCompanyId(),
      lessonId: assignment.getLessonId(),
      status,
      ...metrics,
    });

    if (!existingResult) {
      const created = await this._lessonResultRepository.create(
        lessonResult.toPersistence(),
      );

      if (!created) {
        throw new CustomError(
          HttpStatusCodes.INTERNAL_SERVER_ERROR,
          MESSAGES.LESSON_RESULT_SAVE_FAILED,
        );
      }
    } else {
      if (assignment.getStatus() === "completed") {
        logger.info("Lesson already completed");
        return;
      }
      const updated = await this._lessonResultRepository.update(
        lessonResult.toPersistence(),
      );
      if (!updated) {
        throw new CustomError(
          HttpStatusCodes.INTERNAL_SERVER_ERROR,
          MESSAGES.LESSON_RESULT_SAVE_FAILED,
        );
      }
    }

    await this._lessonAssignmentRepository.update({
      _id: assignmentId,
      status,
    });
    if (status === "completed") {
      const lesson = await this._lessonRepository.findById(
        assignment.getLessonId(),
      );
      if (lesson && assignment.getCompanyId()) {
        const levelMapping: Record<string, "easy" | "medium" | "hard"> = {
          beginner: "easy",
          intermediate: "medium",
          advanced: "hard",
        };
        const difficulty = levelMapping[lesson.level] || "easy";

        const score = await updateCompanyUserStats(
          result.wpm,
          result.accuracy,
          difficulty,
          "lesson",
        );

        await this._statsRepository.updateStats(
          assignment.getCompanyId()!,
          userId,
          {
            wpm: result.wpm,
            accuracy: result.accuracy,
            totalScore: score,
            weeklyScore: score,
            monthlyScore: score,
          },
        );
      }
    }
  }
}
