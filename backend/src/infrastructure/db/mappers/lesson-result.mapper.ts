import { ILessonResultDocument } from "../types/documents";
import { LessonResult } from "../../../domain/entities/lesson-result.entity";

export class LessonResultMapper {
  static toDomain(doc: ILessonResultDocument): LessonResult {
    return new LessonResult({
      companyId: doc?.companyId?.toString(),
      assignmentId: doc?.assignmentId?.toString(),
      userId: doc?.userId?.toString(),
      lessonId: doc?.lessonId?.toString(),
      wpm: doc?.wpm,
      accuracy: doc?.accuracy,
      errors: doc?.errors,
      status: doc?.status,
      createdAt: doc?.createdAt,
    });
  }
}
