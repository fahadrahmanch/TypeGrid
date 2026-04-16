import { ILessonAssignmentDocument } from '../types/documents';
import { LessonAssignmentEntity } from '../../../domain/entities/assign-lesson.entity';

export class LessonAssignmentMapper {
  static toDomain(doc: ILessonAssignmentDocument): LessonAssignmentEntity {
    return new LessonAssignmentEntity({
      id: doc?._id?.toString(),
      userId: doc?.userId?.toString(),
      lessonId: doc?.lessonId?.toString(),
      companyId: doc?.companyId?.toString(),
      status: doc?.status,
      assignedAt: doc?.assignedAt,
      deadlineAt: doc?.deadlineAt,
      completedAt: doc?.completedAt,
      createdAt: doc?.createdAt,
      updatedAt: doc?.updatedAt,
    });
  }
}
