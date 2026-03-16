import {
  LessonCategory,
  LessonLevel,
} from "../../../domain/entities/lesson.entity";
export interface LessonDTO {
  id: string;
  text: string;
  title?: string;
  category: LessonCategory;
  description?: string;
  level: LessonLevel;
  targetWpm?: number;
  targetAccuracy?: number;
  createdAt?: Date;
}
export interface GetLessonDTO {
  _id: string;
  text: string;
  title?: string;
  category: LessonCategory;
  level: LessonLevel;
  description?: string;
  wpm?: number;
  accuracy?: number;
  createdAt?: Date;
}
