import { Request, Response } from "express";
import logger from "../../../utils/logger";
import { HttpStatus } from "../../constants/httpStatus";
import { IGetPracticeTypingContentUseCase } from "../../../application/use-cases/interfaces/user/typing-practice/get-practice-typing-content.interface";
import { MESSAGES } from "../../../domain/constants/messages";
import { CustomError } from "../../../domain/entities/custom-error.entity";
export class TypingPracticeController {
  constructor(private _getPracticeTypingContentUseCase: IGetPracticeTypingContentUseCase) {}

  getRandomPracticeLesson = async (req: Request, res: Response): Promise<void> => {
    const level = req.query.level as string;
    const category = req.query.category as string;

    if (!level || !category) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.LESSON_DATA_REQUIRED);
    }

    const lesson = await this._getPracticeTypingContentUseCase.execute(level, category);

    logger.info("Typing practice lesson retrieved", { level, category });

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.FETCH_SUCCESS,
      lesson,
    });
  };

  getLessonById = async (req: Request, res: Response): Promise<void> => {
    const lessonId = req.params.lessonId;

    if (!lessonId) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.INVALID_REQUEST);
    }

    const lesson = await this._getPracticeTypingContentUseCase.getLessonById(lessonId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.FETCH_SUCCESS,
      lesson,
    });
  };
}
