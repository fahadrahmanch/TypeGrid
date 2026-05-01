import { ILessonDocument } from "../types/documents";
import { LessonEntity } from "../../../domain/entities/lesson.entity";

export class LessonMapper {
  static toDomain(doc: ILessonDocument): LessonEntity {
    return new LessonEntity({
      ...doc,
      _id: doc?._id?.toString(),
      companyId: doc?.companyId?.toString() ?? undefined,
    });
  }
}
