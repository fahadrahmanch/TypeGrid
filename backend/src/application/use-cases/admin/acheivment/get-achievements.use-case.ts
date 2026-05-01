import { IGetAchievementsUseCase } from "../../interfaces/admin/get-achievements.interface";
import { IAchievementRepository } from "../../../../domain/interfaces/repository/user/achievement-repository.interface";
import { AchievementResponseDTO } from "../../../DTOs/admin/achievement.dto";
import { achievementToResponseDTO } from "../../../mappers/admin/achievement-management.mapper";

export class GetAchievementsUseCase implements IGetAchievementsUseCase {
  constructor(private readonly _achievementRepository: IAchievementRepository) {}

  async execute(
    search: string,
    limit: number,
    page: number
  ): Promise<{ achievements: AchievementResponseDTO[]; total: number }> {
    const result = await this._achievementRepository.findAchievements(search, limit, page);

    return {
      achievements: result.achievements.map(achievementToResponseDTO),
      total: result.total,
    };
  }
}
