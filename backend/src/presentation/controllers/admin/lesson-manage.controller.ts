import { Request, Response } from "express";
import { HttpStatus } from "../../constants/httpStatus";
import { ICreateLessonUseCase } from "../../../application/use-cases/interfaces/admin/create-lesson.interface";
import { MESSAGES } from "../../../domain/constants/messages";
import { IGetLessonUseCase } from "../../../application/use-cases/interfaces/admin/get-lesson.interface";
import { IUpdateLessonUseCase } from "../../../application/use-cases/interfaces/admin/update-lesson.interface";
import { IDeleteLessonUseCase } from "../../../application/use-cases/interfaces/admin/delete-lesson.interface";
import { IGetLessonsUseCase } from "../../../application/use-cases/interfaces/admin/get-lessons.interface";
import logger from "../../../utils/logger";
import { CustomError } from "../../../domain/entities/custom-error.entity";

//lesson management controller

export class LessonManageController {
  constructor(
    private _createLessonUseCase: ICreateLessonUseCase,
    private _getLessonUseCase: IGetLessonUseCase,
    private _updateLessonUseCase: IUpdateLessonUseCase,
    private _deleteLessonUseCase: IDeleteLessonUseCase,
    private _getLessonsUseCase: IGetLessonsUseCase
  ) {}

  //create lesson

  createLesson = async (req: Request, res: Response): Promise<void> => {
    const values = req.body;
    if (!values || Object.keys(values).length === 0) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.INVALID_REQUEST);
    }

    await this._createLessonUseCase.execute(values);
    logger.info("Lesson created successfully", {
      title: values.title,
      category: values.category,
    });
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: MESSAGES.CREATE_SUCCESS,
    });
  };

  //get lessons

  getLessons = async (req: Request, res: Response): Promise<void> => {
    const { filter, searchText, page, limit } = req.query;
    const lessons = await this._getLessonsUseCase.execute(
      filter as string,
      searchText as string,
      Number(page),
      Number(limit)
    );
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.FETCH_SUCCESS,
      total: lessons.total,
      data: lessons.lessons,
    });
  };

  //fetch lesson

  fetchLesson = async (req: Request, res: Response): Promise<void> => {
    const { id: lessonId } = req.params;

    if (!lessonId) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.INVALID_REQUEST);
    }

    const lesson = await this._getLessonUseCase.execute(lessonId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.FETCH_SUCCESS,
      data: lesson,
    });
  };

  //update lesson

  updateLesson = async (req: Request, res: Response): Promise<void> => {
    const { id: lessonId } = req.params;
    const values = req.body;

    if (!lessonId || !values || Object.keys(values).length === 0) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.INVALID_REQUEST);
    }

    const updatedLesson = await this._updateLessonUseCase.execute(lessonId, values);

    if (!updatedLesson) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.LESSON_NOT_FOUND);
    }

    logger.info("Lesson updated successfully", { lessonId });
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.UPDATE_SUCCESS,
      data: updatedLesson,
    });
  };

  //delete lesson

  deleteLesson = async (req: Request, res: Response): Promise<void> => {
    const { id: lessonId } = req.params;

    if (!lessonId) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.INVALID_REQUEST);
    }

    await this._deleteLessonUseCase.execute(lessonId);
    logger.info("Lesson deleted successfully", { lessonId });
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.DELETE_SUCCESS,
    });
  };
}
