import { ILessonDocument } from "../../../infrastructure/db/types/documents";
import { LessonDTO } from "../../DTOs/admin/lesson-management.dto";
import { LessonLevel } from "../../../domain/entities/lesson.entity";
export const mapLessonToDTO = (lesson: ILessonDocument): LessonDTO => {
  return {
    id: lesson._id!.toString(),
    text: lesson.text,
    category: lesson.category,
    level: lesson.level as LessonLevel,
    targetWpm: lesson.wpm,
    targetAccuracy: lesson.accuracy,
    createdAt: lesson.createdAt,
  };
};

export const mapLessonDTOforGroupPlay = (lesson: ILessonDocument): LessonDTO => {
  return {
    id: lesson._id!.toString(),
    text: lesson.text,
    category: lesson.category,
    level: lesson.level as LessonLevel,
  };
};
