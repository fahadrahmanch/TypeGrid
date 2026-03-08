import { LessonDTO } from "../../../DTOs/admin/lessonManagement.dto";
import { ICreateLessonUseCase } from "../../interfaces/admin/ICreateLessonUseCase";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/ILessonRepository";
import { LessonEntity } from "../../../../domain/entities/LessonEntity";
import { mapLessonToDTO } from "../../../DTOs/admin/lessonManagement.dto";
export class createLessonUseCase implements ICreateLessonUseCase {
  constructor(private lessonRepository: ILessonRepository) {}
  async execute(lessonData: LessonDTO): Promise<void> {
    const lessonEntity = new LessonEntity(lessonData);
    await this.lessonRepository.create(lessonEntity);
  }

  async getLessons(): Promise<LessonDTO[]> {
    let lessons = await this.lessonRepository.find();
    return lessons.map((item) => {
      return mapLessonToDTO(item);
    });
  }
}
