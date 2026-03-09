import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { IUpdateLessonUseCase } from "../../interfaces/admin/update-lesson.interface";
import { LessonDTO } from "../../../DTOs/admin/lesson-management.dto";
import { mapLessonToDTO } from "../../../mappers/admin/lesson-management.mapper";

export class UpdateLessonUseCase implements IUpdateLessonUseCase {
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
