import { DiscussionEntity } from "../../../entities/user/discussion.entity";
import { IBaseRepository } from "../base-repository.interface";

export interface IDiscussionRepository extends IBaseRepository<DiscussionEntity> {
  getAllDiscussions(skip: number, limit: number): Promise<DiscussionEntity[]>;
  findByUserId(userId: string): Promise<DiscussionEntity[]>;
}
