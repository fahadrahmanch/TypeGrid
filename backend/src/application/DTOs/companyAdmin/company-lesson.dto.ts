import {
  LessonCategory,
  LessonLevel,
} from "../../../domain/entities/lesson.entity";

export interface CompanyLessonDTO {
  id?: string;
  title?: string;
  text?: string;
  category?: LessonCategory;
  //   description?:string,
  level?: LessonLevel;
  wpm?: number;
  companyId?: string;
  accuracy?: number;
  // assignments?:LessonAssignmentEntity[];
  createdAt?: Date;
  createdBy?: string;
}
