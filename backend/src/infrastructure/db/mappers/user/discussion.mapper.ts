import { IDiscussionDocument } from "../../types/documents";
import { DiscussionEntity } from "../../../../domain/entities/user/discussion.entity";

export const discussionToDomain = (doc: IDiscussionDocument): DiscussionEntity => {
  return new DiscussionEntity({
    id: doc._id?.toString(),
    title: doc.title,
    content: doc.content,
    userId: doc.userId.toString(),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  });
};

export const discussionToPersistence = (entity: DiscussionEntity): Partial<IDiscussionDocument> => {
  return {
    title: entity.getTitle(),
    content: entity.getContent(),
    userId: entity.getUserId() as any,
  };
};
