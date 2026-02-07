import { IGetLessonUseCase } from "../../interfaces/admin/IGetLessonUseCase";
import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { LessonDTO, mapLessonToDTO } from "../../../DTOs/admin/lessonManagement.dto";

export class getLessonUseCase implements IGetLessonUseCase {
  constructor(
    private _lessonRepo: IBaseRepository<any>
  ) {}

  async execute(lessonId: string): Promise<LessonDTO> {
    const lesson = await this._lessonRepo.findById(lessonId);
    if (!lesson) {
      throw new Error("Lesson not found");
    }

    return mapLessonToDTO(lesson);
  }
}
