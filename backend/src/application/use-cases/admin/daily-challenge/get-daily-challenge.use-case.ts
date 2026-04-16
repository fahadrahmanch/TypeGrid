import { IGetDailyAssignChallengeUseCase } from '../../interfaces/admin/get-daily-challenge.interface';
import { IDailyAssignChallengeRepository } from '../../../../domain/interfaces/repository/admin/daily-challenge-repository.interface';
import { DailyAssignChallengeResponseDTO } from '../../../DTOs/admin/daily-challenge.dto';
import { DailyAssignChallengeMapper } from '../../../mappers/admin/daily-assign-challenge.mapper';
import { IChallengeRepository } from '../../../../domain/interfaces/repository/admin/challenge-repository.interface';
import { MESSAGES } from '../../../../domain/constants/messages';

export class GetDailyAssignChallengeUseCase implements IGetDailyAssignChallengeUseCase {
  constructor(
    private readonly _dailyAssignChallengeRepository: IDailyAssignChallengeRepository,
    private readonly _challengeRepository: IChallengeRepository
  ) {}

  async execute(id: string): Promise<DailyAssignChallengeResponseDTO | null> {
    const dailyAssignChallenge = await this._dailyAssignChallengeRepository.findById(id);
    if (!dailyAssignChallenge) return null;

    const challenge = await this._challengeRepository.findById(dailyAssignChallenge.getChallengeId());
    if (!challenge) {
      throw new Error(MESSAGES.CHALLENGE_NOT_FOUND);
    }

    return DailyAssignChallengeMapper({
      ...dailyAssignChallenge.toObject(),
      challengeId: { _id: challenge.getId()!, title: challenge.getTitle() },
    });
  }
}
