import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../constants/httpStatus";
import { ICreateLessonUseCase } from "../../../application/use-cases/interfaces/admin/create-lesson.interface";
import { MESSAGES } from "../../../domain/constants/messages";
import { IGetLessonUseCase } from "../../../application/use-cases/interfaces/admin/get-lesson.interface";
import { IUpdateLessonUseCase } from "../../../application/use-cases/interfaces/admin/update-lesson.interface";
import { IDeleteLessonUseCase } from "../../../application/use-cases/interfaces/admin/delete-lesson.interface";
import { IGetLessonsUseCase } from "../../../application/use-cases/interfaces/admin/get-lessons.interface";
import logger from "../../../utils/logger";

//lesson management controller

export class LessonManageController {
  constructor(
    private _createLessonUseCase: ICreateLessonUseCase,
    private _getLessonUseCase: IGetLessonUseCase,
    private _updateLessonUseCase: IUpdateLessonUseCase,
    private _deleteLessonUseCase: IDeleteLessonUseCase,
    private _getLessonsUseCase: IGetLessonsUseCase,
  ) { }

  //create lesson

  async createLesson(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const values = req.body;
      if (!values || Object.keys(values).length === 0) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.INVALID_REQUEST,
        });
        return;
      }

      await this._createLessonUseCase.execute(values);
      logger.info("Lesson created successfully", { title: values.title, category: values.category });
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: MESSAGES.CREATE_SUCCESS,
      });
    } catch (error: any) {
      next(error);
    }
  }

  //get lessons

  async getLessons(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, searchText, page, limit } = req.query;
      const lessons = await this._getLessonsUseCase.execute(status as string,searchText as string,Number(page),Number(limit));
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.FETCH_SUCCESS,
        total:lessons.total,
        data: lessons.lessons,
      });
    } catch (error: any) {
      next(error);
    }
  }

  //fetch lesson

  async fetchLesson(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: lessonId } = req.params;

      if (!lessonId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.INVALID_REQUEST,
        });
        return;
      }

      const lesson = await this._getLessonUseCase.execute(lessonId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.FETCH_SUCCESS,
        data: lesson,
      });
    } catch (error: any) {
      next(error);
    }
  }

  //update lesson

  async updateLesson(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: lessonId } = req.params;
      const values = req.body;

      if (!lessonId || !values || Object.keys(values).length === 0) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.INVALID_REQUEST,
        });
        return;
      }

      const updatedLesson = await this._updateLessonUseCase.execute(
        lessonId,
        values,
      );

      if (!updatedLesson) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: MESSAGES.LESSON_NOT_FOUND,
        });
        return;
      }

      logger.info("Lesson updated successfully", { lessonId });
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.UPDATE_SUCCESS,
        data: updatedLesson,
      });
    } catch (error: any) {
      next(error);
    }
  }

  //delete lesson

  async deleteLesson(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: lessonId } = req.params;

      if (!lessonId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.INVALID_REQUEST,
        });
        return;
      }

      await this._deleteLessonUseCase.execute(lessonId);
      logger.info("Lesson deleted successfully", { lessonId });
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.DELETE_SUCCESS,
      });
    } catch (error: any) {
      next(error);
    }
  }
}
