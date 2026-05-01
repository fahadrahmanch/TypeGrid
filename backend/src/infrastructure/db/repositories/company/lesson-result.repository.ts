import { Model } from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { ILessonResultRepository } from "../../../../domain/interfaces/repository/company/lesson-result-repository.interface";
import { ILessonResultDocument } from "../../types/documents";
import { LessonResult } from "../../../../domain/entities/lesson-result.entity";
import { LessonResultMapper } from "../../mappers/lesson-result.mapper";

export class LessonResultRepository
  extends BaseRepository<ILessonResultDocument, LessonResult>
  implements ILessonResultRepository
{
  constructor(model: Model<ILessonResultDocument>) {
    super(model, LessonResultMapper.toDomain);
  }

  async countCompletedLessons(userId: string): Promise<number> {
    return await this.model.countDocuments({
      userId,
      status: "completed",
    });
  }
}
