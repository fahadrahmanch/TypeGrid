import { Model } from 'mongoose';
import { BaseRepository } from '../../base/base.repository';
import { IRewardRepository } from '../../../../domain/interfaces/repository/admin/reward-repository.interface';
import { IRewardDocument } from '../../types/documents';
import { RewardEntity } from '../../../../domain/entities/reward.entity';
import { RewardMapper } from '../../mappers/reward.mapper';

export class RewardRepository extends BaseRepository<IRewardDocument, RewardEntity> implements IRewardRepository {
  constructor(model: Model<IRewardDocument>) {
    super(model, RewardMapper.toDomain);
  }

  async getRewards(
    searchText: string,
    page: number,
    limit: number
  ): Promise<{ rewards: RewardEntity[]; total: number }> {
    const query: any = {};
    if (searchText) {
      query.description = { $regex: '^' + searchText, $options: 'i' };
    }
    const rawRewards = await this.model
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<IRewardDocument[]>()
      .exec();
    const rewards = rawRewards.map((doc) => this.toDomain(doc));
    const total = await this.model.countDocuments(query);
    return { rewards, total };
  }
}
