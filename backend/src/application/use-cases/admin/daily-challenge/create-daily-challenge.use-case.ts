import { ICreateDailyAssignChallengeUseCase } from '../../../use-cases/interfaces/admin/create-daily-challenge.interface';
import { IDailyAssignChallengeRepository } from '../../../../domain/interfaces/repository/admin/daily-challenge-repository.interface';
import { DailyAssignChallengeResponseDTO } from '../../../DTOs/admin/daily-challenge.dto';
import { DailyAssignChallengeEntity } from '../../../../domain/entities/daily-challenge.entity';
import { DailyAssignChallengeMapper } from '../../../mappers/admin/daily-assign-challenge.mapper';
import { IChallengeRepository } from '../../../../domain/interfaces/repository/admin/challenge-repository.interface';
import { MESSAGES } from '../../../../domain/constants/messages';

export class CreateDailyAssignChallengeUseCase implements ICreateDailyAssignChallengeUseCase {
  constructor(
    private readonly _dailyAssignChallengeRepository: IDailyAssignChallengeRepository,
    private readonly _challengeRepository: IChallengeRepository
  ) {}
  /**
   *
   * @param data
   * @returns
   */
  async execute(data: { challengeId: string; date: Date }): Promise<DailyAssignChallengeResponseDTO> {
    const isExist = await this._dailyAssignChallengeRepository.findOne({
      date: data.date,
    });
    if (isExist) {
      throw new Error(MESSAGES.DAILY_CHALLENGE_ALREADY_EXIST);
    }

    const dailyAssignChallengeEntity = new DailyAssignChallengeEntity(data);
    const dailyAssignChallenge = await this._dailyAssignChallengeRepository.create(
      dailyAssignChallengeEntity.toObject()
    );
    const challenge = await this._challengeRepository.findById(data.challengeId);
    if (!challenge) {
      throw new Error(MESSAGES.CHALLENGE_NOT_FOUND);
    }
    return DailyAssignChallengeMapper({
      ...dailyAssignChallenge.toObject(),
      challengeId: {
        _id: challenge.getId(),
        title: challenge.getTitle(),
      },
    });
  }
}
