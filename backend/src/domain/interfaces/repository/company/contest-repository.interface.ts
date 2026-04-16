import { IBaseRepository } from '../base-repository.interface';
import { ContestEntity } from '../../../entities/company-contest.entity';

export interface IContestRepository extends IBaseRepository<ContestEntity> {
  getGroupContests(groupIds: string[]): Promise<ContestEntity[]>;
  isJoined(contestId: string, userId: string): Promise<ContestEntity | null>;
}
