import { ICommentDocument } from '../../types/documents';
import { CommentEntity } from '../../../../domain/entities/user/comment.entity';

export const commentToDomain = (doc: ICommentDocument): CommentEntity => {
  return new CommentEntity({
    id: doc._id?.toString(),
    DiscussionpostId: doc.DiscussionpostId.toString(),
    userId: doc.userId.toString(),
    content: doc.content,
    replies: doc.replies.map((reply) => ({
      userId: reply.userId.toString(),
      content: reply.content,
      createdAt: reply.createdAt,
    })),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  });
};

export const commentToPersistence = (entity: CommentEntity): Partial<ICommentDocument> => {
  return {
    DiscussionpostId: entity.getDiscussionpostId() as any,
    userId: entity.getUserId() as any,
    content: entity.getContent(),
    replies: entity.getReplies().map((reply) => ({
      userId: reply.userId as any,
      content: reply.content,
      createdAt: reply.createdAt,
    })),
  };
};
