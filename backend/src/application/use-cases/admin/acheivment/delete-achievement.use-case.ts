import { IDeleteAchievementUseCase } from '../../interfaces/admin/delete-achievement.interface';
import { IAchievementRepository } from '../../../../domain/interfaces/repository/user/achievement-repository.interface';
import { MESSAGES } from '../../../../domain/constants/messages';
import { CustomError } from '../../../../domain/entities/custom-error.entity';
import { HttpStatusCodes } from '../../../../domain/enums/http-status-codes.enum';

export class DeleteAchievementUseCase implements IDeleteAchievementUseCase {
  constructor(private readonly _achievementRepository: IAchievementRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this._achievementRepository.findById(id);
    if (!existing) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.ACHIEVEMENT_NOT_FOUND);
    }

    await this._achievementRepository.delete(id);
  }
}
