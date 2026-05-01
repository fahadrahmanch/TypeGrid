import { Response } from "express";
import logger from "../../../utils/logger";
import { AuthRequest } from "../../../types/AuthRequest";
import { HttpStatus } from "../../constants/httpStatus";
import { IGetMyLessonsUseCase } from "../../../application/use-cases/interfaces/companyUser/get-my-lessons.interface";
import { MESSAGES } from "../../../domain/constants/messages";
import { IGetAssignLessonUseCase } from "../../../application/use-cases/interfaces/companyUser/get-assign-lesson.interface";
import { ISaveLessonResultUseCase } from "../../../application/use-cases/interfaces/companyUser/save-lesson-result.interface";
import { CustomError } from "../../../domain/entities/custom-error.entity";

export class MyLessonsController {
  constructor(
    private _getMyLessonsUseCase: IGetMyLessonsUseCase,
    private _getAssignLessonUseCase: IGetAssignLessonUseCase,
    private _saveLessonResultUseCase: ISaveLessonResultUseCase
  ) {}

  myLessons = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId as string;
    const myLessons = await this._getMyLessonsUseCase.execute(userId);
    res.status(HttpStatus.OK).json({
      success: true,
      data: myLessons,
    });
  };

  getAssignedLessonById = async (req: AuthRequest, res: Response): Promise<void> => {
    const { assignmentId } = req.params;
    const userId = req.user?.userId;
    if (!assignmentId) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.ASSIGNMENT_ID_REQUIRED);
    }

    if (!userId) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);
    }

    const assignedLesson = await this._getAssignLessonUseCase.execute(assignmentId);

    res.status(HttpStatus.OK).json({
      success: true,
      data: assignedLesson,
    });
  };

  saveLessonResult = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const assignmentId = req.params.id;
    const result = req.body;
    if (!userId) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }
    if (!assignmentId) {
      throw new CustomError(HttpStatus.BAD_REQUEST, "assignmentId is required");
    }
    await this._saveLessonResultUseCase.execute(userId, assignmentId, result);
    logger.info(MESSAGES.LESSON_RESULT_SAVED_SUCCESS, { userId, assignmentId });
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.LESSON_RESULT_SAVED_SUCCESS,
    });
  };
}
