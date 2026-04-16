import { IUpdateDailyAssignChallengeUseCase } from '../../interfaces/admin/update-daily-challenge.interface';
import { IDailyAssignChallengeRepository } from '../../../../domain/interfaces/repository/admin/daily-challenge-repository.interface';
import { DailyAssignChallengeResponseDTO } from '../../../DTOs/admin/daily-challenge.dto';
import { DailyAssignChallengeMapper } from '../../../mappers/admin/daily-assign-challenge.mapper';
import { IChallengeRepository } from '../../../../domain/interfaces/repository/admin/challenge-repository.interface';
import { MESSAGES } from '../../../../domain/constants/messages';

export class UpdateDailyAssignChallengeUseCase implements IUpdateDailyAssignChallengeUseCase {
  constructor(
    private readonly _dailyAssignChallengeRepository: IDailyAssignChallengeRepository,
    private readonly _challengeRepository: IChallengeRepository
  ) {}

  async execute(
    id: string,
    data: { challengeId?: string; date?: Date }
  ): Promise<DailyAssignChallengeResponseDTO | null> {
    const existing = await this._dailyAssignChallengeRepository.findById(id);
    if (!existing) return null;

    if (data.date) {
      const isExist = await this._dailyAssignChallengeRepository.findOne({
        date: data.date,
        _id: { $ne: id },
      });
      if (isExist) {
        throw new Error(MESSAGES.DAILY_CHALLENGE_ALREADY_EXIST);
      }
    }

    const updated = await this._dailyAssignChallengeRepository.updateById(id, data);
    if (!updated) return null;

    const challenge = await this._challengeRepository.findById(updated.getChallengeId());
    if (!challenge) {
      throw new Error(MESSAGES.CHALLENGE_NOT_FOUND);
    }

    return DailyAssignChallengeMapper({
      ...updated.toObject(),
      challengeId: { _id: challenge.getId()!, title: challenge.getTitle() },
    });
  }
}
