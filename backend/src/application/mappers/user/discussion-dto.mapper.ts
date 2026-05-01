import { DiscussionEntity } from "../../../domain/entities/user/discussion.entity";
import { IDiscussionDTO } from "../../DTOs/user/get-discussions.dto";
import { UserEntity } from "../../../domain/entities";
import { IDiscussionDetailDTO } from "../../DTOs/user/get-discussion-detail.dto";

export const discussionToDTO = (discussion: DiscussionEntity, user: UserEntity | null, commentCount: number): IDiscussionDTO => {
  return {
    id: discussion.getId() || "",
    title: discussion.getTitle(),
    content: discussion.getContent(),
    authorName: user?.name || "Unknown",
    authorAvatar: user?.imageUrl || "",
    postedAt: discussion.getCreatedAt()?.toISOString() || new Date().toISOString(),
    commentCount: commentCount,
  };
};

export const discussionDetailToDTO = (discussion: DiscussionEntity, user: UserEntity | null, comments: any[]): IDiscussionDetailDTO => {
  return {
    ...discussionToDTO(discussion, user, comments.length),
    comments: [],
  };
};
