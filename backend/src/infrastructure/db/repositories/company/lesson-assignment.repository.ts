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

  async getPendingUsers(companyId: string): Promise<LessonAssignmentEntity[]> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const pendingUsers = await this.model
      .find({
        companyId: companyId,
        status: { $ne: "completed" },
        deadlineAt: { $lt: startOfToday }
      })
      .lean()
      .exec();
    return pendingUsers.map((user) => this.toDomain(user));
  }
}
