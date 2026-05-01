import { IDiscussionDTO } from "../../../DTOs/user/get-discussions.dto";
import { IGetMyDiscussionsUseCase } from "../../interfaces/user/get-my-discussions.interface";
import { IDiscussionRepository } from "../../../../domain/interfaces/repository/user/discussion-repository.interface";
import { discussionToDTO } from "../../../mappers/user/discussion-dto.mapper";
import { ICommentRepository } from "../../../../domain/interfaces/repository/user/comment-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";

export class GetMyDiscussionsUseCase implements IGetMyDiscussionsUseCase {
  constructor(private _discussionRepository: IDiscussionRepository, private _discussionCommentRepository: ICommentRepository, private _userRepository: IUserRepository) { }

  async execute(userId: string): Promise<IDiscussionDTO[]> {
    const rawDiscussions = await this._discussionRepository.find({userId: userId});
      const allDiscussions = await Promise.all(
        rawDiscussions.map(async (discussion) => {
          const comments = await this._discussionCommentRepository.getAllComments(discussion.getId() || "");
          const user = await this._userRepository.findById(discussion.getUserId() || "");
          return discussionToDTO(discussion, user, comments.length);
        })
      );
      return allDiscussions;
  }
}
