import { ICreateAchievementUseCase } from "../../interfaces/admin/create-achievement.interface";
import { IAchievementRepository } from "../../../../domain/interfaces/repository/user/achievement-repository.interface";
import { CreateAchievementDTO, AchievementResponseDTO } from "../../../DTOs/admin/achievement.dto";
import { achievementToEntity, achievementToResponseDTO } from "../../../mappers/admin/achievement-management.mapper";
import { MESSAGES } from "../../../../domain/constants/messages";

export class CreateAchievementUseCase implements ICreateAchievementUseCase {
    constructor(
        private readonly _achievementRepository: IAchievementRepository,
    ) { }

    async createAchievement(data: CreateAchievementDTO): Promise<AchievementResponseDTO> {
        const existing = await this._achievementRepository.findOne({ title: data.title });
        if (existing) {
            throw new Error(MESSAGES.ACHIEVEMENT_ALREADY_EXISTS || "Achievement with this title already exists");
        }

        const achievementEntity = achievementToEntity(data);
        const createdEntity = await this._achievementRepository.create(achievementEntity.toObject());
        
        return achievementToResponseDTO(createdEntity);
    }
}