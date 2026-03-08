import { IGetLessonUseCase } from "../../interfaces/admin/IGetLessonUseCase";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/ILessonRepository";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/customError";
import { HttpStatusCodes } from "../../../../domain/enums/httpStatusCodes";
import {
  LessonDTO,
  mapLessonToDTO,
} from "../../../DTOs/admin/lessonManagement.dto";

export class getLessonUseCase implements IGetLessonUseCase {
  constructor(private _lessonRepo: ILessonRepository) {}

  async execute(lessonId: string): Promise<LessonDTO> {
    const lesson = await this._lessonRepo.findById(lessonId);
    if (!lesson) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.LESSON_NOT_FOUND,
      );
    }

    return mapLessonToDTO(lesson);
  }
}
