import { CommentEntity } from "../../../entities/user/comment.entity";
import { IBaseRepository } from "../base-repository.interface";

export interface ICommentRepository extends IBaseRepository<CommentEntity> {
  getAllComments(discussionId: string): Promise<CommentEntity[]>;
}
