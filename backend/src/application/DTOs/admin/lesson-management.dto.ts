import {
  LessonCategory,
  LessonLevel,
} from "../../../domain/entities/lesson.entity";
export interface LessonDTO {
  id: string;
  text: string;
  category: LessonCategory;
  description?: string;
  level: LessonLevel;
  targetWpm?: number;
  targetAccuracy?: number;
  createdAt?: Date;
}

