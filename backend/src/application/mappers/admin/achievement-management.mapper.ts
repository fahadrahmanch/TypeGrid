import { AchievementEntity } from '../../../domain/entities/achievement.entity';
import { AchievementResponseDTO, CreateAchievementDTO } from '../../DTOs/admin/achievement.dto';

export const achievementToEntity = (dto: CreateAchievementDTO): AchievementEntity => {
  return new AchievementEntity({
    title: dto.title,
    description: dto.description,
    imageUrl: dto.imageUrl,
    minWpm: dto.minWpm,
    minAccuracy: dto.minAccuracy,
    minGame: dto.minGame,
    xp: dto.xp,
  });
};

export const achievementToResponseDTO = (entity: AchievementEntity): AchievementResponseDTO => {
  return {
    _id: entity.id,
    title: entity.title,
    description: entity.description,
    imageUrl: entity.imageUrl,
    minWpm: entity.minWpm,
    minAccuracy: entity.minAccuracy,
    minGame: entity.minGame,
    xp: entity.xp,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
};
