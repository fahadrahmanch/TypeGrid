import { IDeleteDailyAssignChallengeUseCase } from '../../interfaces/admin/delete-daily-challenge.interface';
import { IDailyAssignChallengeRepository } from '../../../../domain/interfaces/repository/admin/daily-challenge-repository.interface';

export class DeleteDailyAssignChallengeUseCase implements IDeleteDailyAssignChallengeUseCase {
  constructor(private readonly _dailyAssignChallengeRepository: IDailyAssignChallengeRepository) {}

  async execute(id: string): Promise<void> {
    await this._dailyAssignChallengeRepository.delete(id);
  }
}
