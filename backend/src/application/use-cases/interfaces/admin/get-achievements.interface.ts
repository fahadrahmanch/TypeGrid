import { AchievementResponseDTO } from '../../../DTOs/admin/achievement.dto';

export interface IGetAchievementsUseCase {
  execute(
    search: string,
    limit: number,
    page: number
  ): Promise<{ achievements: AchievementResponseDTO[]; total: number }>;
}
