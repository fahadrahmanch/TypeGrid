import { IGetPracticeTypingContentUseCase } from "../../interfaces/user/typing-practice/get-practice-typing-content.interface";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { PracticeTypingDTO } from "../../../DTOs/user/practice-typing.dto";
import { mapPracticeTypingToDTO } from "../../../DTOs/user/practice-typing.dto";
export class GetPracticeTypingContentUseCase implements IGetPracticeTypingContentUseCase {
  constructor(private lessonRepository: ILessonRepository) {}
  async execute(level: string, category: string): Promise<PracticeTypingDTO> {
    if (!level || !category) {
      throw new CustomError(
        HttpStatusCodes.BAD_REQUEST,
        MESSAGES.LEVEL_AND_CATEGORY_REQUIRED,
      );
    }
    const lessons = await this.lessonRepository.find({
      level,
      category,
    });
    if (lessons.length === 0) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.NO_LESSONS_FOUND_FOR_CRITERIA,
      );
    }
    const randomIndex = Math.floor(Math.random() * lessons.length);
    const selectedLesson = lessons[randomIndex];
    return mapPracticeTypingToDTO(selectedLesson);
  }

  async getLessonById(lessonId: string): Promise<PracticeTypingDTO> {
    const lesson = await this.lessonRepository.findById(lessonId);
    if (!lesson) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.LESSON_NOT_FOUND,
      );
    }
    return mapPracticeTypingToDTO(lesson);
  }
}
