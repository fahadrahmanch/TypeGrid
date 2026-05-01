import { IGetAllDiscussionsUseCase } from "../../interfaces/user/get-all-discussions.interface";
import { IDiscussionRepository } from "../../../../domain/interfaces/repository/user/discussion-repository.interface";
import { IDiscussionDTO } from "../../../DTOs/user/get-discussions.dto";
import { discussionToDTO } from "../../../mappers/user/discussion-dto.mapper";
import { ICommentRepository } from "../../../../domain/interfaces/repository/user/comment-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
export class GetAllDiscussionsUseCase implements IGetAllDiscussionsUseCase {
  constructor(
    private _discussionRepository: IDiscussionRepository,
    private _discussionCommentRepository: ICommentRepository,
    private _userRepository: IUserRepository,

  ) { }

  async execute(page: number, limit: number): Promise<IDiscussionDTO[]> {
    const skip = (page - 1) * limit;
    const rawDiscussions = await this._discussionRepository.getAllDiscussions(skip, limit);
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
