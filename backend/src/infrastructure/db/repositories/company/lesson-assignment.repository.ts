import { Model } from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { ILessonAssignmentRepository } from "../../../../domain/interfaces/repository/company/lesson-assignment-repository.interface";
import { ILessonAssignmentDocument } from "../../types/documents";
import { LessonAssignmentEntity } from "../../../../domain/entities/assign-lesson.entity";
import { LessonAssignmentMapper } from "../../mappers/lesson-assignment.mapper";

export class LessonAssignmentRepository
  extends BaseRepository<ILessonAssignmentDocument, LessonAssignmentEntity>
  implements ILessonAssignmentRepository
{
  constructor(model: Model<ILessonAssignmentDocument>) {
    super(model, LessonAssignmentMapper.toDomain);
  }
}
