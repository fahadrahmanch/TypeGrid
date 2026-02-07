import { IUpdateLessonUseCase } from "../../interfaces/admin/IUpdateLessonUseCase";
import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { LessonDTO, mapLessonToDTO } from "../../../DTOs/admin/lessonManagement.dto";

export class updateLessonUseCase implements IUpdateLessonUseCase {
  constructor(
    private _baseRepositoryLesson: IBaseRepository<any>
  ) {}

  async execute(lessonId: string, values: any): Promise<LessonDTO> {
    const lesson = await this._baseRepositoryLesson.findById(lessonId);

    if (!lesson) {
      throw new Error("Lesson not found");
    }


const updatedLesson=await this._baseRepositoryLesson.update({_id:lessonId,...values});
  return mapLessonToDTO(updatedLesson);
  }
}
