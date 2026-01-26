import { Request, Response } from "express";
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
    private _assignLessonUseCase:IAssignLessonUseCase
  ) {}

  async createLesson(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { title, description, level, wpm, text, accuracy, category } =
        req.body;
      const user = req.user?.userId;
      if (!title || !level || !wpm || !text || !accuracy || !category) {
        throw new Error("Lesson data is required");
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
        res.status(400).json({
          success: false,
          message: "Lesson creation failed",
        });
      }
      res.status(200).json({
        success: true,
        message: "Lesson created successfully",
        lesson,
      });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error?.message || "Something went wrong",
      });
    }
  }

  async getLessons(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
      }
      const lessons = await this._getLessonsUseCase.execute(userId);
      if (!lessons) {
        res.status(400).json({
          success: false,
          message: "Lessons not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Lessons fetched successfully",
        lessons,
      });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error?.message || "Something went wrong",
      });
    }
  }

  async getLesson(req: AuthRequest, res: Response): Promise<void> {
    try {
      const lessonId = req.params.id;
      if (!lessonId) {
        throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
      }
      const lesson = await this._getLessonUseCase.execute(lessonId);
      if (!lesson) {
        res.status(400).json({
          success: false,
          message: "Lesson not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Lesson fetched successfully",
        lesson,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error?.message || "Something went wrong",
      });
    }
  }

  async updateLesson(req: AuthRequest, res: Response): Promise<void> {
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
        res.status(400).json({
          success: false,
          message: "Lesson not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Lesson updated successfully",
        lesson,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error?.message || "Something went wrong",
      });
    }
  }

  async deleteLesson(req: Request, res: Response): Promise<void> {
    try {
      const lessonId = req.params.id;
      if (!lessonId) {
        throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
      }
      await this._deleteCompanyLessonUseCase.execute(lessonId);
      res.status(200).json({
        success: true,
        message: "Lesson deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error?.message || "Something went wrong",
      });
    }
  }

  async getAdminLessons(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
      }
      const lessons = await this._getAdminLessonsUseCase.execute();
      if (!lessons) {
        res.status(400).json({
          success: false,
          message: "Lessons not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Lessons fetched successfully",
        lessons,
      });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error?.message || "Something went wrong",
      });
    }
  }

  async assignLessons(req: AuthRequest, res: Response): Promise<void> {
    try {
      const users:string[]=req.body.users;
      const userId=req.user?.userId
      const deadline=req.body.deadline
      const lessons:string[]=req.body.lessons;
      if (!users || users.length === 0 || !lessons || lessons.length === 0 || !userId) {
      res.status(400).json(MESSAGES.ALL_FIELDS_REQUIRED)
      return
      }
      await this._assignLessonUseCase.execute(userId,users,lessons,deadline)
      res.status(200).json({
      success: true,
      message: "Lessons assigned successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to assign lessons"
    });
  }
  }
}
