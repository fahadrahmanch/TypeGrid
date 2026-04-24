import { ICreateCommentUseCase } from "../../interfaces/user/create-comment.interface";
import { ICommentRepository } from "../../../../domain/interfaces/repository/user/comment-repository.interface";
import { IDiscussionRepository } from "../../../../domain/interfaces/repository/user/discussion-repository.interface";

import { CommentEntity } from "../../../../domain/entities/user/comment.entity";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatus } from "../../../../presentation/constants/httpStatus";

export class CreateCommentUseCase implements ICreateCommentUseCase {
  constructor(
    private _commentRepository: ICommentRepository,
    private _discussionRepository: IDiscussionRepository
  ) {}

  async execute(userId: string, discussionId: string, content: string): Promise<void> {
    const discussion = await this._discussionRepository.findById(discussionId);
    if (!discussion) {
      throw new CustomError(HttpStatus.NOT_FOUND, "Discussion not found");
    }

    const comment = new CommentEntity({
      userId,
      DiscussionpostId: discussionId,
      content,
      replies: [],
    });
    console.log("comment", comment);

    await this._commentRepository.create(comment);
  }
}
