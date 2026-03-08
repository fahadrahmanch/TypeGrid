import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../constants/httpStatus";
import { ICreateLessonUseCase } from "../../../application/use-cases/interfaces/admin/ICreateLessonUseCase";
import { MESSAGES } from "../../../domain/constants/messages";
import { IGetLessonUseCase } from "../../../application/use-cases/interfaces/admin/IGetLessonUseCase";
import { IUpdateLessonUseCase } from "../../../application/use-cases/interfaces/admin/IUpdateLessonUseCase";
import { IDeleteLessonUseCase } from "../../../application/use-cases/interfaces/admin/IDeleteLessonUseCase";
import logger from "../../../utils/logger";
export class LessonManageController {
  constructor(
    private _createLessonUseCase: ICreateLessonUseCase,
    private _getLessonUseCase: IGetLessonUseCase,
    private _updateLessonUseCase: IUpdateLessonUseCase,
    private _deleteLessonUseCase: IDeleteLessonUseCase,
  ) {}

  async createLesson(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const values = req.body;
      await this._createLessonUseCase.execute(values);
      logger.info("Lesson created successfully", { title: values.title, category: values.category });
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Lesson created successfully",
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getLessons(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lessons = await this._createLessonUseCase.getLessons();
      res.status(HttpStatus.OK).json({ success: true, lessons });
    } catch (error: any) {
      next(error);
    }
  }

  async fetchLesson(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: lessonId } = req.params;

      if (!lessonId) {
        throw new Error(MESSAGES.SOMETHING_WENT_WRONG);
      }

      const lesson = await this._getLessonUseCase.execute(lessonId);

      res.status(HttpStatus.OK).json({
        success: true,
        data: lesson,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async updateLesson(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: lessonId } = req.params;

      const values = req.body;
      const updatedLesson = await this._updateLessonUseCase.execute(
        lessonId,
        values,
      );
      if (!updatedLesson) {
        throw new Error(MESSAGES.SOMETHING_WENT_WRONG);
      }
      logger.info("Lesson updated successfully", { lessonId });
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Lesson updated successfully",
        data: updatedLesson,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async deleteLesson(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lessonId = req.params.id;
      await this._deleteLessonUseCase.execute(lessonId);
      logger.info("Lesson deleted successfully", { lessonId });
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Lesson deleted successfully",
      });
    } catch (error: any) {
      next(error);
    }
  }
}
