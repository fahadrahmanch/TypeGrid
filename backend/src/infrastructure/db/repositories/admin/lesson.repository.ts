import { Model } from 'mongoose';
import { BaseRepository } from '../../base/base.repository';
import { ILessonRepository } from '../../../../domain/interfaces/repository/admin/lesson-repository.interface';
import { ILessonDocument } from '../../types/documents';
import { LessonEntity } from '../../../../domain/entities/lesson.entity';
import { LessonMapper } from '../../mappers/lesson.mapper';
import { Status } from '../../../../domain/enums/status.enum';

export class LessonRepository extends BaseRepository<ILessonDocument, LessonEntity> implements ILessonRepository {
  constructor(model: Model<ILessonDocument>) {
    super(model, LessonMapper.toDomain);
  }
  async getLessons(
    status: string,
    searchText: string,
    page: number,
    limit: number
  ): Promise<{ lessons: LessonEntity[]; total: number }> {
    const query: any = {};
    if (status && status !== Status.ALL) {
      query.level = status;
    }
    if (searchText) {
      query.title = { $regex: '^' + searchText, $options: 'i' };
    }
    const rawLessons = await this.model
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<ILessonDocument[]>()
      .exec();
    const lessons = rawLessons.map((doc) => this.toDomain(doc));
    const total = await this.model.countDocuments(query);
    return { lessons, total };
  }
}
