import { IDeleteDiscussionUseCase } from "../../interfaces/user/delete-discussion.interface";
import { IDiscussionRepository } from "../../../../domain/interfaces/repository/user/discussion-repository.interface";
import { ICommentRepository } from "../../../../domain/interfaces/repository/user/comment-repository.interface";

export class DeleteDiscussionUseCase implements IDeleteDiscussionUseCase {
  constructor(
    private _discussionRepository: IDiscussionRepository,
    private _commentRepository: ICommentRepository
  ) {}

  async execute(discussionId: string): Promise<void> {
    const discussion = await this._discussionRepository.findById(discussionId);
    if (!discussion) {
      throw new Error("Discussion not found");
    }
    await this._discussionRepository.delete(discussionId);
    await this._commentRepository.deleteMany({ DiscussionpostId: discussionId }); 
  }
}
