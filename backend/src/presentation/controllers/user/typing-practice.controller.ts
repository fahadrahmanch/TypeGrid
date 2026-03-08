import { Request, Response, NextFunction } from "express";
import logger from "../../../utils/logger";
import { HttpStatus } from "../../constants/httpStatus";
import { IGetPracticeTypingContentUseCase } from "../../../application/use-cases/interfaces/user/typing-practice/get-practice-typing-content.interface";
import { MESSAGES } from "../../../domain/constants/messages";
export class TypingPracticeController {
  constructor(
    private _getPracticeTypingContentUseCase: IGetPracticeTypingContentUseCase,
  ) {}

  async startTypingPractice(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const level = req.query.level as string;
      const category = req.query.category as string;
      if (!level || !category) {
        throw new Error(MESSAGES.LESSON_DATA_REQUIRED);
      }
      const lesson = await this._getPracticeTypingContentUseCase.execute(
        level,
        category,
      );
      if (!lesson) {
        throw new Error(MESSAGES.LESSON_NOT_FOUND);
      }
      logger.info("Typing practice started", { level, category });

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Typing practice started",
        lesson,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getLessonById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lessonId = req.params.lessonId;
      if (!lessonId) {
        throw new Error(MESSAGES.INVALID_REQUEST);
      }
      const lesson =
        await this._getPracticeTypingContentUseCase.getLessonById(lessonId);
      if (!lesson) {
        throw new Error(MESSAGES.LESSON_NOT_FOUND);
      }
      res.status(HttpStatus.OK).json({ success: true, lesson });
    } catch (error: any) {
      next(error);
    }
  }
}
