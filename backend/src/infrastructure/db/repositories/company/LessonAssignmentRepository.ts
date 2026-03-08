import { Model } from "mongoose";
import { BaseRepository } from "../../base/BaseRepository";
import { ILessonAssignmentRepository } from "../../../../domain/interfaces/repository/company/ILessonAssignmentRepository";
import { ILessonAssignmentDocument } from "../../types/documents";

export class LessonAssignmentRepository
  extends BaseRepository<ILessonAssignmentDocument>
  implements ILessonAssignmentRepository
{
  constructor(model: Model<ILessonAssignmentDocument>) {
    super(model);
  }
}
