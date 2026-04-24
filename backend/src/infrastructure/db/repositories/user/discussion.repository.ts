import { Model } from 'mongoose';
import { BaseRepository } from '../../base/base.repository';
import { IDiscussionRepository } from '../../../../domain/interfaces/repository/user/discussion-repository.interface';
import { IDiscussionDocument } from '../../types/documents';
import { DiscussionEntity } from '../../../../domain/entities/user/discussion.entity';
import { discussionToDomain } from '../../mappers/user/discussion.mapper';

export class DiscussionRepository extends BaseRepository<IDiscussionDocument, DiscussionEntity> implements IDiscussionRepository {
  constructor(model: Model<IDiscussionDocument>) {
    super(model, discussionToDomain);
  }

  async getAllDiscussions(skip: number, limit: number): Promise<DiscussionEntity[]> {
    const discussions = await this.model
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
    return discussions.map((discussion) => discussionToDomain(discussion));
  }
}
