import { Request, Response, NextFunction } from "express";
import logger from "../../../utils/logger";
import { HttpStatus } from "../../constants/httpStatus";
import { IGetPracticeTypingContentUseCase } from "../../../application/use-cases/interfaces/user/typing-practice/get-practice-typing-content.interface";
import { MESSAGES } from "../../../domain/constants/messages";
export class TypingPracticeController {
  constructor(
    private _getPracticeTypingContentUseCase: IGetPracticeTypingContentUseCase,
  ) {}

  async getRandomPracticeLesson(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const level = req.query.level as string;
      const category = req.query.category as string;

      if (!level || !category) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.LESSON_DATA_REQUIRED,
        });
        return;
      }

      const lesson = await this._getPracticeTypingContentUseCase.execute(
        level,
        category,
      );

      logger.info("Typing practice lesson retrieved", { level, category });

      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.FETCH_SUCCESS,
        lesson,
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async getLessonById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const lessonId = req.params.lessonId;

      if (!lessonId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.INVALID_REQUEST,
        });
        return;
      }

      const lesson =
        await this._getPracticeTypingContentUseCase.getLessonById(lessonId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.FETCH_SUCCESS,
        lesson,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
}
