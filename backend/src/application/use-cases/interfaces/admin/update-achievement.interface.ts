import { AchievementResponseDTO, CreateAchievementDTO } from '../../../DTOs/admin/achievement.dto';

export interface IUpdateAchievementUseCase {
  execute(id: string, data: Partial<CreateAchievementDTO>): Promise<AchievementResponseDTO>;
}
