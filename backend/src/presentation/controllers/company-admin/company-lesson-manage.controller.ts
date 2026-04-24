import { Response } from 'express';
import { HttpStatus } from '../../constants/httpStatus';
import logger from '../../../utils/logger';
import { AuthRequest } from '../../../types/AuthRequest';
import { ICreateCompanyLessonUseCase } from '../../../application/use-cases/interfaces/companyAdmin/create-company-lesson.interface';
import { IGetCompanyLessonsUseCase } from '../../../application/use-cases/interfaces/companyAdmin/get-company-lessons.interface';
import { IGetLessonUseCase } from '../../../application/use-cases/interfaces/companyAdmin/get-lesson.interface';
import { MESSAGES } from '../../../domain/constants/messages';
import { IUpdateCompanyLessonUseCase } from '../../../application/use-cases/interfaces/companyAdmin/update-company-lesson.interface';
import { IDeleteCompanyLessonUseCase } from '../../../application/use-cases/interfaces/companyAdmin/delete-company-lesson.interface';
import { IGetAdminLessonsUseCase } from '../../../application/use-cases/interfaces/companyAdmin/get-admin-lesson.interface';
import { IAssignLessonUseCase } from '../../../application/use-cases/interfaces/companyAdmin/assign-lesson.interface';
import { IAssignGroupLessonUseCase } from '../../../application/use-cases/interfaces/companyAdmin/assign-group-lesson.interface';
import { IGetPendingUsersUseCase } from '../../../application/use-cases/interfaces/companyAdmin/get-pending-users.interface';
import { CustomError } from '../../../domain/entities/custom-error.entity';

export class CompanyLessonManageController {
  constructor(
    private _createLessonUseCase: ICreateCompanyLessonUseCase,
    private _getLessonsUseCase: IGetCompanyLessonsUseCase,
    private _getLessonUseCase: IGetLessonUseCase,
    private _updateCompanyLessonUseCase: IUpdateCompanyLessonUseCase,
    private _deleteCompanyLessonUseCase: IDeleteCompanyLessonUseCase,
    private _getAdminLessonsUseCase: IGetAdminLessonsUseCase,
    private _assignLessonUseCase: IAssignLessonUseCase,
    private _assignGroupLessonUseCase: IAssignGroupLessonUseCase,
    private _getPendingUsersUseCase: IGetPendingUsersUseCase
  ) {}

  //create lesson

  createLesson = async (req: AuthRequest, res: Response): Promise<void> => {
    const { title, description, level, wpm, text, accuracy, category } = req.body;
    const userId = req.user?.userId;
    if (!userId) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }
    if (!title || !level || !wpm || !text || !accuracy || !category) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.LESSON_DATA_REQUIRED);
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
      throw new CustomError(HttpStatus.INTERNAL_SERVER_ERROR, MESSAGES.SOMETHING_WENT_WRONG);
    }
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.CREATE_SUCCESS,
      lesson,
    });
    logger.info('Company lesson created successfully', { userId });
  };

  // get lessons

  getLessons = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const lessons = await this._getLessonsUseCase.execute(userId);
    if (!lessons) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.LESSON_NOT_FOUND);
    }
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.FETCH_SUCCESS,
      lessons,
    });
  };

  // get lesson

  getLesson = async (req: AuthRequest, res: Response): Promise<void> => {
    const lessonId = req.params.id;
    if (!lessonId) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.LESSON_ID_REQUIRED);
    }
    const lesson = await this._getLessonUseCase.execute(lessonId);
    if (!lesson) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.LESSON_NOT_FOUND);
    }
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.FETCH_SUCCESS,
      lesson,
    });
  };

  // update lesson

  updateLesson = async (req: AuthRequest, res: Response): Promise<void> => {
    const lessonId = req.params.id;
    const lessonData = req.body;
    if (!lessonId) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.LESSON_ID_REQUIRED);
    }
    const lesson = await this._updateCompanyLessonUseCase.execute(lessonId, lessonData);
    if (!lesson) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.LESSON_NOT_FOUND);
    }
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.UPDATE_SUCCESS,
      lesson,
    });
    logger.info('Company lesson updated successfully', {
      userId: req.user?.userId,
      lessonId,
    });
  };

  // delete lesson

  deleteLesson = async (req: AuthRequest, res: Response): Promise<void> => {
    const lessonId = req.params.id;
    if (!lessonId) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.LESSON_ID_REQUIRED);
    }
    await this._deleteCompanyLessonUseCase.execute(lessonId);
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.DELETE_SUCCESS,
    });
    logger.info('Company lesson deleted successfully', {
      userId: req.user?.userId,
      lessonId,
    });
  };

  // get admin lessons

  getAdminLessons = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const lessons = await this._getAdminLessonsUseCase.execute();
    if (!lessons) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.LESSON_NOT_FOUND);
    }
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.FETCH_SUCCESS,
      lessons,
    });
  };

  // assign lessons

  assignLessons = async (req: AuthRequest, res: Response): Promise<void> => {
    const users: string[] = (req.body.users || []).filter(Boolean);
    const userId = req.user?.userId;
    const deadline = req.body.deadline;
    const lessons: string[] = (req.body.lessons || []).filter(Boolean);

    if (users.length === 0 || lessons.length === 0 || !userId) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.ALL_FIELDS_REQUIRED);
    }
    await this._assignLessonUseCase.execute(userId, users, lessons, deadline);
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.UPDATE_SUCCESS,
    });
  };

  assignLessonToGroup = async (req: AuthRequest, res: Response): Promise<void> => {
    const groups: string[] = (req.body.groups || []).filter(Boolean);
    console.log("groups",groups);
    const userId = req.user?.userId;
    const deadline = req.body.deadline;
    const lessons: string[] = (req.body.lessons || []).filter(Boolean);
    if (groups.length === 0 || lessons.length === 0 || !userId) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.ALL_FIELDS_REQUIRED);
    }
    await this._assignGroupLessonUseCase.execute(userId, groups, lessons, deadline);
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.UPDATE_SUCCESS,
    });
  };

  // get pending users

  getPendingUsers = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    console.log("userId",userId)
    if (!userId) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }

    const { users, total, userIds } = await this._getPendingUsersUseCase.execute(userId);
    console.log(users,total,userIds)

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.FETCH_SUCCESS,
      total,
      data: users,
      userIds,
    });
  };
}
