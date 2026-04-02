import { RewardResponseDTO } from "../../../DTOs/admin/reward.dto";
export interface IGetRewardByIdUseCase {
  execute(id: string): Promise<RewardResponseDTO>;
}
