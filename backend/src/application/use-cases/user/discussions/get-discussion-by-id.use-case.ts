import { IGetDiscussionByIdUseCase } from "../../interfaces/user/get-discussion-by-id.interface";
import { IDiscussionRepository } from "../../../../domain/interfaces/repository/user/discussion-repository.interface";
import { ICommentRepository } from "../../../../domain/interfaces/repository/user/comment-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { IDiscussionDetailDTO } from "../../../DTOs/user/get-discussion-detail.dto";
import { discussionToDTO } from "../../../mappers/user/discussion-dto.mapper";

export class GetDiscussionByIdUseCase implements IGetDiscussionByIdUseCase {
  constructor(
    private _discussionRepository: IDiscussionRepository,
    private _commentRepository: ICommentRepository,
    private _userRepository: IUserRepository
  ) {}

  async execute(id: string): Promise<IDiscussionDetailDTO | null> {
    const discussion = await this._discussionRepository.findById(id);
    if (!discussion) {
      return null;
    }

    const discussionUser = await this._userRepository.findById(discussion.getUserId() || "");
    const commentEntities = await this._commentRepository.getAllComments(id);
    const mappedComments = await Promise.all(
      commentEntities.map(async (comment) => {
        const user = await this._userRepository.findById(comment.getUserId() || "");
        const replies = await Promise.all(comment.getReplies().map(async (item) => {
          const replyUser = await this._userRepository.findById(item.userId || "");
          return {
            id: item.userId || "",
            authorName: replyUser?.name || "Unknown",
            authorAvatar: replyUser?.imageUrl || "",
            content: item.content,
            postedAt: item.createdAt?.toISOString() || new Date().toISOString(),
          };
        }));
        return {
          id: comment.getId() || "",
          authorName: user?.name || "Unknown",
          authorAvatar: user?.imageUrl || "",
          replies: replies,
          content: comment.getContent(),
          postedAt: comment.getCreatedAt()?.toISOString() || new Date().toISOString(),
        };
      })
    );

    return {
      ...discussionToDTO(discussion, discussionUser, mappedComments.length),
      comments: mappedComments,
    };
  }
}
