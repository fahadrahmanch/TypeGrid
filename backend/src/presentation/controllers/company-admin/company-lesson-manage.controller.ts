import { Response, NextFunction } from "express";
import { HttpStatus } from "../../constants/httpStatus";
import logger from "../../../utils/logger";
import { AuthRequest } from "../../../types/AuthRequest";
import { ICreateCompanyLessonUseCase } from "../../../application/use-cases/interfaces/companyAdmin/create-company-lesson.interface";
import { IGetCompanyLessonsUseCase } from "../../../application/use-cases/interfaces/companyAdmin/get-company-lessons.interface";
import { IGetLessonUseCase } from "../../../application/use-cases/interfaces/companyAdmin/get-lesson.interface";
import { MESSAGES } from "../../../domain/constants/messages";
import { IUpdateCompanyLessonUseCase } from "../../../application/use-cases/interfaces/companyAdmin/update-company-lesson.interface";
import { IDeleteCompanyLessonUseCase } from "../../../application/use-cases/interfaces/companyAdmin/delete-company-lesson.interface";
import { IGetAdminLessonsUseCase } from "../../../application/use-cases/interfaces/companyAdmin/get-admin-lesson.interface";
import { IAssignLessonUseCase } from "../../../application/use-cases/interfaces/companyAdmin/assign-lesson.interface";
import { CustomError } from "../../../domain/entities/custom-error.entity";

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

  //create lesson

  async createLesson(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, description, level, wpm, text, accuracy, category } =
        req.body;
      const userId = req.user?.userId;
      if (!userId) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: MESSAGES.AUTH_USER_NOT_FOUND,
        });
        return;
      }
      if (!title || !level || !wpm || !text || !accuracy || !category) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.LESSON_DATA_REQUIRED,
        });
        return;
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
      const lesson = await this._createLessonUseCase.execute(userId, lessonData);
      if (!lesson) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: MESSAGES.SOMETHING_WENT_WRONG,
        });
        return;
      }
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.CREATE_SUCCESS,
        lesson,
      });
      logger.info("Company lesson created successfully", { userId });

    } catch (error: any) {
      next(error);
    }
  }

  // get lessons

  async getLessons(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: MESSAGES.AUTH_USER_NOT_FOUND,
        });
        return;
      }
      const lessons = await this._getLessonsUseCase.execute(userId);
      if (!lessons) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: MESSAGES.LESSON_NOT_FOUND,
        });
        return;
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

  // get lesson

  async getLesson(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const lessonId = req.params.id;
      if (!lessonId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.LESSON_ID_REQUIRED,
        });
        return;
      }
      const lesson = await this._getLessonUseCase.execute(lessonId);
      if (!lesson) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: MESSAGES.LESSON_NOT_FOUND,
        });
        return;
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

  // update lesson

  async updateLesson(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const lessonId = req.params.id;
      const lessonData = req.body;
      if (!lessonId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.LESSON_ID_REQUIRED,
        });
        return;
      }
      const lesson = await this._updateCompanyLessonUseCase.execute(
        lessonId,
        lessonData,
      );
      if (!lesson) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: MESSAGES.LESSON_NOT_FOUND,
        });
        return;
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

  // delete lesson

  async deleteLesson(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const lessonId = req.params.id;
      if (!lessonId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.LESSON_ID_REQUIRED,
        });
        return;
      }
      await this._deleteCompanyLessonUseCase.execute(lessonId);
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.DELETE_SUCCESS,
      });
      logger.info("Company lesson deleted successfully", { userId: req.user?.userId, lessonId });
    } catch (error: any) {
    
        next(error);
      
    }
  }

  // get admin lessons

  async getAdminLessons(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: MESSAGES.AUTH_USER_NOT_FOUND,
        });
        return;
      }
      const lessons = await this._getAdminLessonsUseCase.execute();
      if (!lessons) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: MESSAGES.LESSON_NOT_FOUND,
        });
        return;
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

  // assign lessons

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
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.ALL_FIELDS_REQUIRED,
        });
        return;
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
