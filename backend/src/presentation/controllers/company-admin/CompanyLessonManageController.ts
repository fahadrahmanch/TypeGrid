import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../constants/httpStatus";
import logger from "../../../utils/logger";
import { AuthRequest } from "../../../types/AuthRequest";
import { ICreateCompanyLessonUseCase } from "../../../application/use-cases/interfaces/companyAdmin/ICreateCompanyLessonUseCase";
import { IGetCompanyLessonsUseCase } from "../../../application/use-cases/interfaces/companyAdmin/IGetCompanyLessonsUseCase";
import { IGetLessonUseCase } from "../../../application/use-cases/interfaces/companyAdmin/IGetLessonUseCase";
import { MESSAGES } from "../../../domain/constants/messages";
import { IUpdateCompanyLessonUseCase } from "../../../application/use-cases/interfaces/companyAdmin/IUpdateCompanyLessonUseCase";
import { IDeleteCompanyLessonUseCase } from "../../../application/use-cases/interfaces/companyAdmin/IDeleteCompanyLessonUseCase";
import { IGetAdminLessonsUseCase } from "../../../application/use-cases/interfaces/companyAdmin/IGetAdminLessonUseCase";
import { IAssignLessonUseCase } from "../../../application/use-cases/interfaces/companyAdmin/IAssignLessonUseCase";
export class CompanyLessonManageController {
  constructor(
    private _createLessonUseCase: ICreateCompanyLessonUseCase,
    private _getLessonsUseCase: IGetCompanyLessonsUseCase,
    private _getLessonUseCase: IGetLessonUseCase,
    private _updateCompanyLessonUseCase: IUpdateCompanyLessonUseCase,
    private _deleteCompanyLessonUseCase: IDeleteCompanyLessonUseCase,
    private _getAdminLessonsUseCase: IGetAdminLessonsUseCase,
    private _assignLessonUseCase: IAssignLessonUseCase,
  ) {}

  async createLesson(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, description, level, wpm, text, accuracy, category } =
        req.body;
      const user = req.user?.userId;
      if (!title || !level || !wpm || !text || !accuracy || !category) {
        throw new Error(MESSAGES.LESSON_DATA_REQUIRED);
      }
      const lessonData = {
        title,
        description,
        level,
        wpm,
        text,
        accuracy,
        category,
      };
      const lesson = await this._createLessonUseCase.execute(user!, lessonData);
      if (!lesson) {
        throw new Error(MESSAGES.SOMETHING_WENT_WRONG);
      }
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.CREATE_SUCCESS,
        lesson,
      });
      logger.info("Company lesson created successfully", { userId: user });

    } catch (error: any) {
      next(error);
    }
  }

  async getLessons(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
      }
      const lessons = await this._getLessonsUseCase.execute(userId);
      if (!lessons) {
        throw new Error(MESSAGES.LESSON_NOT_FOUND);
      }
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.FETCH_SUCCESS,
        lessons,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getLesson(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const lessonId = req.params.id;
      if (!lessonId) {
        throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
      }
      const lesson = await this._getLessonUseCase.execute(lessonId);
      if (!lesson) {
        throw new Error("Lesson not found");
      }
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.FETCH_SUCCESS,
        lesson,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async updateLesson(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const lessonId = req.params.id;
      const lessonData = req.body;
      if (!lessonId) {
        throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
      }
      const lesson = await this._updateCompanyLessonUseCase.execute(
        lessonId,
        lessonData,
      );
      if (!lesson) {
        throw new Error("Lesson not found");
      }
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.UPDATE_SUCCESS,
        lesson,
      });
      logger.info("Company lesson updated successfully", { userId: req.user?.userId, lessonId });
    } catch (error: any) {
      next(error);
    }
  }

  async deleteLesson(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lessonId = req.params.id;
      if (!lessonId) {
        throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
      }
      await this._deleteCompanyLessonUseCase.execute(lessonId);
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.DELETE_SUCCESS,
      });
      logger.info("Company lesson deleted successfully", { userId: (req as any).user?.userId, lessonId });
    } catch (error: any) {
      next(error);
    }
  }

  async getAdminLessons(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
      }
      const lessons = await this._getAdminLessonsUseCase.execute();
      if (!lessons) {
        throw new Error(MESSAGES.LESSON_NOT_FOUND);
      }
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.FETCH_SUCCESS,
        lessons,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async assignLessons(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const users: string[] = req.body.users;
      const userId = req.user?.userId;
      const deadline = req.body.deadline;
      const lessons: string[] = req.body.lessons;
      if (
        !users ||
        users.length === 0 ||
        !lessons ||
        lessons.length === 0 ||
        !userId
      ) {
        throw new Error(MESSAGES.ALL_FIELDS_REQUIRED);
      }
      await this._assignLessonUseCase.execute(userId, users, lessons, deadline);
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.UPDATE_SUCCESS,
      });
    } catch (error: any) {
      next(error);
    }
  }
}
