import { Request, Response, NextFunction } from "express";
import logger from "../../../utils/logger";
import { AuthRequest } from "../../../types/AuthRequest";
import { HttpStatus } from "../../constants/httpStatus";
import { IGetMyLessonsUseCase } from "../../../application/use-cases/interfaces/companyUser/get-my-lessons.interface";
import { MESSAGES } from "../../../domain/constants/messages";
import { IGetAssignLessonUseCase } from "../../../application/use-cases/interfaces/companyUser/get-assign-lesson.interface";
import { ISaveLessonResultUseCase } from "../../../application/use-cases/interfaces/companyUser/save-lesson-result.interface";

export class MyLessonsController {
  constructor(
    private _getMyLessonsUseCase: IGetMyLessonsUseCase,
    private _getAssignLessonUseCase: IGetAssignLessonUseCase,
    private _saveLessonResultUseCase: ISaveLessonResultUseCase,
  ) {}

  async myLessons(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId as string;

      const myLessons = await this._getMyLessonsUseCase.execute(userId);

      res.status(HttpStatus.OK).json({
        success: true,
        data: myLessons,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getAssignedLessonById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { assignmentId } = req.params;
      const userId = req.user?.userId;
      if (!assignmentId) {
        throw new Error("assignmentId is required");
      }

      if (!userId) {
        throw new Error("Unauthorized");
      }

      const assignedLesson =
        await this._getAssignLessonUseCase.execute(assignmentId);

      res.status(HttpStatus.OK).json({
        success: true,
        data: assignedLesson,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async saveLessonResult(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const assignmentId = req.params.id;
      const result = req.body;
      if (!userId) {
        throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
      }
      if (!assignmentId) {
        throw new Error("assignmentId is required");
      }
      await this._saveLessonResultUseCase.execute(userId, assignmentId, result);
      logger.info("Lesson result saved successfully", { userId, assignmentId });
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Lesson result saved successfully",
      });
    } catch (error: any) {
      next(error);
    }
  }
}
