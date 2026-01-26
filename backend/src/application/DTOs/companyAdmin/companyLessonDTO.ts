import { LessonCategory,LessonLevel } from "../../../domain/entities/LessonEntity";
// export type AssignmentStatus = "active" | "completed" | "expired";

// export interface LessonAssignmentEntity {
//   userId: string;
//   assignedAt?: Date;
//   expiresAt?: Date;
//   status: AssignmentStatus;
// }

export interface CompanyLessonDTO{
  id?: string;
  title?: string;
  text?: string;
  category?: LessonCategory;
//   description?:string,
  level?: LessonLevel;
  wpm?: number;
  companyId?:string;
  accuracy?: number;
  // assignments?:LessonAssignmentEntity[];
  createdAt?: Date;
  createdBy?:string
}

export const mapLessonDTOforCompanyLesson=(lesson:any):CompanyLessonDTO=>{
  return{
    id: lesson._id.toString(),
    title: lesson.title,
    text: lesson.text,
    category: lesson.category,
    level: lesson.level,
    wpm: lesson.wpm,
    accuracy: lesson.accuracy,
    // assignments:lesson.assignments,
  createdAt: lesson.createdAt,
    createdBy:lesson.createdBy,
   companyId: lesson.companyId ? lesson.companyId.toString() : undefined,
  }
}
