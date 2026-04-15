import { IDeleteAchievementUseCase } from "../../interfaces/admin/delete-achievement.interface";
import { IAchievementRepository } from "../../../../domain/interfaces/repository/user/achievement-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";

export class DeleteAchievementUseCase implements IDeleteAchievementUseCase {
  constructor(
    private readonly _achievementRepository: IAchievementRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this._achievementRepository.findById(id);
    if (!existing) {
      throw new Error(MESSAGES.NOT_FOUND || "Achievement not found");
    }

    await this._achievementRepository.delete(id);
  }
}
