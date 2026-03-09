import { ILessonDocument } from "../../../infrastructure/db/types/documents";
import { CompanyLessonDTO } from "../../DTOs/companyAdmin/company-lesson.dto";

export const mapLessonDTOforCompanyLesson = (lesson: ILessonDocument): CompanyLessonDTO => {
  return {
    id: lesson._id!.toString(),
    title: lesson.title,
    text: lesson.text,
    category: lesson.category,
    level: lesson.level as any,
    wpm: lesson.wpm,
    accuracy: lesson.accuracy,
    createdAt: lesson.createdAt,
    createdBy: lesson.createdBy,
    companyId: lesson.companyId ? lesson.companyId.toString() : undefined,
  };
};
