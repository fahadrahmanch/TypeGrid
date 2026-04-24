import { ICreateReplyUseCase } from "../../interfaces/user/create-reply.interface";
import { ICommentRepository } from "../../../../domain/interfaces/repository/user/comment-repository.interface";

import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatus } from "../../../../presentation/constants/httpStatus";

export class CreateReplyUseCase implements ICreateReplyUseCase {
  constructor(
    private _commentRepository: ICommentRepository
  ) {}

  async execute(userId: string, commentId: string, content: string): Promise<void> {
    const parentComment = await this._commentRepository.findById(commentId);
    if (!parentComment) {
      throw new CustomError(HttpStatus.NOT_FOUND, "Comment not found");
    }

    parentComment.addReply(userId, content);
    console.log("parentComment", parentComment);
    await this._commentRepository.update({_id:commentId, ...parentComment});
  }
}
 