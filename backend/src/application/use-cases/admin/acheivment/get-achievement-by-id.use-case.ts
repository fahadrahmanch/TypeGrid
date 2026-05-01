import { IGetAchievementByIdUseCase } from "../../interfaces/admin/get-achievement-by-id.interface";
import { IAchievementRepository } from "../../../../domain/interfaces/repository/user/achievement-repository.interface";
import { AchievementResponseDTO } from "../../../DTOs/admin/achievement.dto";
import { achievementToResponseDTO } from "../../../mappers/admin/achievement-management.mapper";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";

export class GetAchievementByIdUseCase implements IGetAchievementByIdUseCase {
  constructor(private readonly _achievementRepository: IAchievementRepository) {}

  async execute(id: string): Promise<AchievementResponseDTO> {
    const achievement = await this._achievementRepository.findById(id);
    if (!achievement) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.ACHIEVEMENT_NOT_FOUND);
    }
    return achievementToResponseDTO(achievement);
  }
}
