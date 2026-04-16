import { CreateRewardDTO, RewardResponseDTO } from '../../../DTOs/admin/reward.dto';
export interface ICreateRewardUseCase {
  execute(reward: CreateRewardDTO): Promise<RewardResponseDTO>;
}
