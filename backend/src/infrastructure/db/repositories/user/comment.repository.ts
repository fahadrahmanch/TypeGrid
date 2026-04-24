import { Model } from 'mongoose';
import { BaseRepository } from '../../base/base.repository';
import { ICommentRepository } from '../../../../domain/interfaces/repository/user/comment-repository.interface';
import { ICommentDocument } from '../../types/documents';
import { CommentEntity } from '../../../../domain/entities/user/comment.entity';
import { commentToDomain } from '../../mappers/user/comment.mapper';

export class CommentRepository extends BaseRepository<ICommentDocument, CommentEntity> implements ICommentRepository {
  constructor(model: Model<ICommentDocument>) {
    super(model, commentToDomain);
  }

  async getAllComments(discussionId: string): Promise<CommentEntity[]> {
    const docs = await this.model
      .find({DiscussionpostId:discussionId})
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return docs.map((doc) => this.toDomain(doc));
  }
}
