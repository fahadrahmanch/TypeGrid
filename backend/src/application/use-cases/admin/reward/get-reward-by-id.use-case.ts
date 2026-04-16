import { IGetRewardByIdUseCase } from '../../interfaces/admin/get-reward-by-id.interface';
import { IRewardRepository } from '../../../../domain/interfaces/repository/admin/reward-repository.interface';
import { CustomError } from '../../../../domain/entities/custom-error.entity';
import { HttpStatusCodes } from '../../../../domain/enums/http-status-codes.enum';
import { MESSAGES } from '../../../../domain/constants/messages';
import { RewardResponseDTO } from '../../../DTOs/admin/reward.dto';
import { mapToReward } from '../../../mappers/admin/reward-management.mapper';

export class GetRewardByIdUseCase implements IGetRewardByIdUseCase {
  constructor(private readonly _rewardRepository: IRewardRepository) {}
  async execute(id: string): Promise<RewardResponseDTO> {
    const reward = await this._rewardRepository.findById(id);
    if (!reward) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.REWARD_NOT_FOUND);
    }

    return mapToReward(reward.toObject());
  }
}
