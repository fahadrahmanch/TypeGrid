import { LessonCategory,LessonLevel } from "../../../domain/entities/LessonEntity";
export interface LessonDTO {
  id: string;
  text: string;
  category: LessonCategory;
  description?:string,
  level: LessonLevel;
  targetWpm?: number;
  targetAccuracy?: number;
  createdAt?: Date;
}
export const mapLessonToDTO = (lesson: any): LessonDTO => {
  return {
    id: lesson._id.toString(),
    text: lesson.text,
    category: lesson.category,
    level: lesson.level,
    targetWpm: lesson.targetWpm,
    targetAccuracy: lesson.targetAccuracy,
    createdAt: lesson.createdAt,
  };
};

export const mapLessonDTOforGroupPlay=(lesson:any):LessonDTO=>{
  return{
    id: lesson._id.toString(),
    text: lesson.text,
    category: lesson.category,
    level: lesson.level,
  };
};
