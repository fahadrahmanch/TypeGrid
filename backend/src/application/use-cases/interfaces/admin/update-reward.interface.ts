import { UpdateRewardDTO, RewardResponseDTO } from "../../../DTOs/admin/reward.dto";
export interface IUpdateRewardUseCase {
    execute(id: string, reward: UpdateRewardDTO): Promise<RewardResponseDTO>;
}