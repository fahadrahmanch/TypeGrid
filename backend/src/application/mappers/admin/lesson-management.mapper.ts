import { LessonDTO } from '../../DTOs/admin/lesson-management.dto';
import { LessonLevel } from '../../../domain/entities/lesson.entity';
import { LessonEntity } from '../../../domain/entities/lesson.entity';
export const mapLessonToDTO = (lesson: LessonEntity): LessonDTO => {
  return {
    id: lesson._id!.toString(),
    title: lesson.title,
    text: lesson.text,
    category: lesson.category,
    level: lesson.level as LessonLevel,
    targetWpm: lesson.wpm,
    targetAccuracy: lesson.accuracy,
    createdAt: lesson.createdAt,
  };
};

export const mapLessonDTOforGroupPlay = (lesson: LessonEntity): LessonDTO => {
  return {
    id: lesson._id!.toString(),
    text: lesson.text,
    category: lesson.category,
    level: lesson.level as LessonLevel,
  };
};
