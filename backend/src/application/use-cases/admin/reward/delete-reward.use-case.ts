import { IRewardRepository } from "../../../../domain/interfaces/repository/admin/reward-repository.interface";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { MESSAGES } from "../../../../domain/constants/messages";
import { IDeleteRewardUseCase } from "../../interfaces/admin/delete-reward.interface";

/**
 * Use case responsible for deleting a reward.
 */
export class DeleteRewardUseCase implements IDeleteRewardUseCase {
  constructor(private readonly _rewardRepository: IRewardRepository) {}

  /**
   * Deletes a reward by its ID.
   * @param id - The ID of the reward to delete.
   * @throws {CustomError} If the reward does not exist.
   */
  async execute(id: string): Promise<void> {
    const reward = await this._rewardRepository.findById(id);

    if (!reward) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.REWARD_NOT_FOUND);
    }

    await this._rewardRepository.delete(id);
  }
}
