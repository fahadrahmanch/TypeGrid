import { IUpdateAchievementUseCase } from '../../interfaces/admin/update-achievement.interface';
import { IAchievementRepository } from '../../../../domain/interfaces/repository/user/achievement-repository.interface';
import { CreateAchievementDTO, AchievementResponseDTO } from '../../../DTOs/admin/achievement.dto';
import { achievementToResponseDTO } from '../../../mappers/admin/achievement-management.mapper';
import { MESSAGES } from '../../../../domain/constants/messages';
import { CustomError } from '../../../../domain/entities/custom-error.entity';
import { HttpStatusCodes } from '../../../../domain/enums/http-status-codes.enum';

export class UpdateAchievementUseCase implements IUpdateAchievementUseCase {
  constructor(private readonly _achievementRepository: IAchievementRepository) {}

  async execute(id: string, data: Partial<CreateAchievementDTO>): Promise<AchievementResponseDTO> {
    const existing = await this._achievementRepository.findById(id);
    if (!existing) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.ACHIEVEMENT_NOT_FOUND);
    }

    existing.update({
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      minWpm: data.minWpm,
      minAccuracy: data.minAccuracy,
      minGame: data.minGame,
      xp: data.xp,
    });

    const updatedEntity = await this._achievementRepository.update(existing.toObject());

    if (!updatedEntity) {
      throw new CustomError(HttpStatusCodes.INTERNAL_SERVER_ERROR, MESSAGES.UPDATE_FAILED);
    }

    return achievementToResponseDTO(updatedEntity);
  }
}
