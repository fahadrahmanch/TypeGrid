import { LessonDTO } from "../../../DTOs/admin/lesson-management.dto";
import { ICreateLessonUseCase } from "../../interfaces/admin/create-lesson.interface";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
import { LessonEntity } from "../../../../domain/entities/lesson.entity";
import { mapLessonToDTO } from "../../../mappers/admin/lesson-management.mapper";
export class CreateLessonUseCase implements ICreateLessonUseCase {
  constructor(private lessonRepository: ILessonRepository) {}
  async execute(lessonData: LessonDTO): Promise<void> {
    const lessonEntityInstance = new LessonEntity(lessonData);
    await this.lessonRepository.create(lessonEntityInstance);
  }

  async getLessons(): Promise<LessonDTO[]> {
    console.log("hello there")
    let lessons = await this.lessonRepository.find();
    return lessons.map((item) => {
      return mapLessonToDTO(item);
    });
  }
}
