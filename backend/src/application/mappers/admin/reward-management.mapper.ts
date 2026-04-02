import { RewardResponseDTO } from "../../DTOs/admin/reward.dto";
export function mapToReward(reward: RewardResponseDTO) {
  return {
    _id: reward._id || "",
    xp: reward.xp,
    description: reward.description,
  };
}
