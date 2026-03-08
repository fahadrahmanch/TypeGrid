import { Model } from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { ILessonAssignmentRepository } from "../../../../domain/interfaces/repository/company/lesson-assignment-repository.interface";
import { ILessonAssignmentDocument } from "../../types/documents";

export class LessonAssignmentRepository
  extends BaseRepository<ILessonAssignmentDocument>
  implements ILessonAssignmentRepository
{
  constructor(model: Model<ILessonAssignmentDocument>) {
    super(model);
  }
}
