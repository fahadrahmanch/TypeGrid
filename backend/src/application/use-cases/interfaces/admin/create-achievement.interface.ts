import { CreateAchievementDTO } from '../../../DTOs/admin/achievement.dto';
import { AchievementResponseDTO } from '../../../DTOs/admin/achievement.dto';
export interface ICreateAchievementUseCase {
  createAchievement(data: CreateAchievementDTO): Promise<AchievementResponseDTO>;
}
