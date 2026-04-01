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
    } catch (error: unknown) {
      next(error);
    } 
  }

  async getAssignedLessonById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { assignmentId } = req.params;
      const userId = req.user?.userId;
      if (!assignmentId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "assignmentId is required",
        });
        return;
      }

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: MESSAGES.UNAUTHORIZED,
        });
        return;
      }

      const assignedLesson =
        await this._getAssignLessonUseCase.execute(assignmentId);

      res.status(HttpStatus.OK).json({
        success: true,
        data: assignedLesson,
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async saveLessonResult(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const assignmentId = req.params.id;
      const result = req.body;
      if (!userId) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: MESSAGES.AUTH_USER_NOT_FOUND,
        });
        return;
      }
      if (!assignmentId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "assignmentId is required",
        });
        return;
      }
      await this._saveLessonResultUseCase.execute(userId, assignmentId, result);
      logger.info("Lesson result saved successfully", { userId, assignmentId });
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Lesson result saved successfully",
      });
    } catch (error: unknown) {
      next(error);
    }
  }
}
