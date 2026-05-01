import { CreateRewardDTO } from "../../../DTOs/admin/reward.dto";
import { ICreateRewardUseCase } from "../../interfaces/admin/create-reward.interface";
import { IRewardRepository } from "../../../../domain/interfaces/repository/admin/reward-repository.interface";
import { RewardEntity } from "../../../../domain/entities/reward.entity";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { MESSAGES } from "../../../../domain/constants/messages";
import { mapToReward } from "../../../mappers/admin/reward-management.mapper";
import { RewardResponseDTO } from "../../../DTOs/admin/reward.dto";
/**
 * use case for create new reward
 */
export class CreateRewardUseCase implements ICreateRewardUseCase {
  constructor(private readonly _rewardRepository: IRewardRepository) {}
  /**
   *
   * @param reward
   * @returns newReward
   */
  async execute(reward: CreateRewardDTO): Promise<RewardResponseDTO | any> {
    const isRewardExist = await this._rewardRepository.findOne({
      xp: reward.xp,
    });
    if (isRewardExist) {
      throw new CustomError(HttpStatusCodes.CONFLICT, MESSAGES.REWARD_ALREADY_EXISTS);
    }
    const rewardEntity = new RewardEntity(reward);
    const newReward = (await this._rewardRepository.create(rewardEntity.toObject())).toObject();
    return mapToReward(newReward);
  }
}
