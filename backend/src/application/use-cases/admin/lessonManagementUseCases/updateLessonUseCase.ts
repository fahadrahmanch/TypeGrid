import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/ILessonRepository";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/customError";
import { HttpStatusCodes } from "../../../../domain/enums/httpStatusCodes";
import { IUpdateLessonUseCase } from "../../interfaces/admin/IUpdateLessonUseCase";
import {
  LessonDTO,
  mapLessonToDTO,
} from "../../../DTOs/admin/lessonManagement.dto";

export class updateLessonUseCase implements IUpdateLessonUseCase {
  constructor(private lessonRepository: ILessonRepository) {}

  async execute(lessonId: string, values: any): Promise<LessonDTO> {
    const lesson = await this.lessonRepository.findById(lessonId);

    if (!lesson) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.LESSON_NOT_FOUND,
      );
    }

    const updatedLesson = await this.lessonRepository.update({
      _id: lessonId,
      ...values,
    });
    return mapLessonToDTO(updatedLesson);
  }
}
