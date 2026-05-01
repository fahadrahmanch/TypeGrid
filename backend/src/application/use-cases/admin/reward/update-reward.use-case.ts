import { IUpdateRewardUseCase } from "../../interfaces/admin/update-reward.interface";
import { IRewardRepository } from "../../../../domain/interfaces/repository/admin/reward-repository.interface";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { MESSAGES } from "../../../../domain/constants/messages";
import { UpdateRewardDTO, RewardResponseDTO } from "../../../DTOs/admin/reward.dto";
import { mapToReward } from "../../../mappers/admin/reward-management.mapper";

export class UpdateRewardUseCase implements IUpdateRewardUseCase {
  constructor(private readonly _rewardRepository: IRewardRepository) {}
  async execute(id: string, reward: UpdateRewardDTO): Promise<RewardResponseDTO> {
    const existingReward = await this._rewardRepository.findById(id);
    if (!existingReward) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.REWARD_NOT_FOUND);
    }

    if (reward.xp !== undefined) {
      const isRewardExist = await this._rewardRepository.findOne({
        xp: reward.xp,
      });
      if (isRewardExist && isRewardExist.getId() !== id) {
        throw new CustomError(HttpStatusCodes.CONFLICT, MESSAGES.REWARD_ALREADY_EXISTS);
      }
    }

    const updatedReward = await this._rewardRepository.update({
      _id: id,
      ...reward,
    });
    if (!updatedReward) {
      throw new CustomError(HttpStatusCodes.INTERNAL_SERVER_ERROR, MESSAGES.SOMETHING_WENT_WRONG);
    }

    return mapToReward(updatedReward.toObject());
  }
}
