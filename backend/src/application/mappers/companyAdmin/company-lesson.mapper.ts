import { CompanyLessonDTO } from "../../DTOs/companyAdmin/company-lesson.dto";

export type CompanyLessonPayload = {
  _id?: any;
  title?: string;
  text?: string;
  category?: string;
  level?: string;
  wpm?: number;
  accuracy?: number;
  createdAt?: Date;
  createdBy?: string;
  companyId?: any;
};

export const mapLessonDTOforCompanyLesson = (lesson: CompanyLessonPayload): CompanyLessonDTO => {
  return {
    id: lesson._id?.toString()??"",
    title: lesson.title,
    text: lesson.text,
    category: lesson.category as any,
    level: lesson.level as any,
    wpm: lesson.wpm,
    accuracy: lesson.accuracy,
    createdAt: lesson.createdAt,
    createdBy: lesson.createdBy,
    companyId: lesson.companyId ? lesson.companyId.toString() : undefined,
  };
};
