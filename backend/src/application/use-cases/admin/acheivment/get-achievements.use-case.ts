import { IGetAchievementsUseCase } from "../../interfaces/admin/get-achievements.interface";
import { IAchievementRepository } from "../../../../domain/interfaces/repository/user/achievement-repository.interface";
import { AchievementResponseDTO } from "../../../DTOs/admin/achievement.dto";
import { achievementToResponseDTO } from "../../../mappers/admin/achievement-management.mapper";

export class GetAchievementsUseCase implements IGetAchievementsUseCase {
  constructor(
    private readonly _achievementRepository: IAchievementRepository,
  ) {}

  async execute(
    search: string,
    limit: number,
    page: number
  ): Promise<{ achievements: AchievementResponseDTO[]; total: number }> {
    const filter = search 
      ? { title: { $regex: search, $options: "i" } } 
      : {};

    const all = await this._achievementRepository.find(filter);
    
    const total = all.length; 

    const start = (page - 1) * limit;
    const paginated = all.slice(start, start + limit);

    return {
      achievements: paginated.map(achievementToResponseDTO),
      total: total,
    };
  }
}
