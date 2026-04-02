import { IGetRewardsUseCase } from "../../interfaces/admin/get-rewards.interface";
import { IRewardRepository } from "../../../../domain/interfaces/repository/admin/reward-repository.interface";
import { RewardResponseDTO } from "../../../DTOs/admin/reward.dto";
import { mapToReward } from "../../../mappers/admin/reward-management.mapper";
export class GetRewardsUseCase implements IGetRewardsUseCase {
  constructor(private readonly _rewardRepository: IRewardRepository) {}
  async execute(
    searchText: string,
    page: number,
    limit: number,
  ): Promise<{ rewards: RewardResponseDTO[]; total: number }> {
    const { rewards, total } = await this._rewardRepository.getRewards(
      searchText,
      page,
      limit,
    );
    return {
      rewards: rewards.map((reward) => mapToReward(reward.toObject())),
      total,
    };
  }
}
