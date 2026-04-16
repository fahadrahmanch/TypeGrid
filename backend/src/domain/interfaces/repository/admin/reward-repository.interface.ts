import { RewardEntity } from '../../../../domain/entities/reward.entity';
import { IBaseRepository } from '../base-repository.interface';

export interface IRewardRepository extends IBaseRepository<RewardEntity> {
  getRewards(searchText: string, page: number, limit: number): Promise<{ rewards: RewardEntity[]; total: number }>;
}
