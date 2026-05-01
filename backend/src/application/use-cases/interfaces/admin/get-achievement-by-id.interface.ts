import { AchievementResponseDTO } from "../../../DTOs/admin/achievement.dto";

export interface IGetAchievementByIdUseCase {
  execute(id: string): Promise<AchievementResponseDTO>;
}
