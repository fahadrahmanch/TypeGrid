import { IAchievementRepository } from "../../../../domain/interfaces/repository/user/achievement-repository.interface";
import { IUserAchievementRepository } from "../../../../domain/interfaces/repository/user/user-achievement-repository.interface";
import { UserAchievementEntity } from "../../../../domain/entities/user-achievement.entity";
import { achievementToResponseDTO } from "../../../mappers/admin/achievement-management.mapper";
import { AchievementResponseDTO } from "../../../DTOs/admin/achievement.dto";

export interface IEvaluateAchievementsUseCase {
  execute(userId: string, gameResult: { wpm: number; accuracy: number }): Promise<AchievementResponseDTO[]>;
}

export class EvaluateAchievementsUseCase implements IEvaluateAchievementsUseCase {
  constructor(
    private readonly _achievementRepository: IAchievementRepository,
    private readonly _userAchievementRepository: IUserAchievementRepository,
  ) {}

  async execute(userId: string, gameResult: { wpm: number; accuracy: number }): Promise<AchievementResponseDTO[]> {
    // 1. Get all possible achievements
    const allAchievements = await this._achievementRepository.find();
    
    // 2. Get user's current achievements to avoid duplicates
    const userAchievements = await this._userAchievementRepository.findByUserId(userId);
    const earnedIds = new Set(userAchievements.map(ua => ua.achievementId.toString()));

    // 3. Simple stats (actual implementation might need a dedicated stats repo for "total games")
    // For now, we evaluate based on the current game result and potentially count existing achievements as "games played" proxy or just skip minGame for this simple demo.
    
    const newlyEarned: AchievementResponseDTO[] = [];

    for (const ach of allAchievements) {
      if (earnedIds.has(ach.id!.toString())) continue;

      let qualified = true;

      if (ach.minWpm && gameResult.wpm < ach.minWpm) qualified = false;
      if (ach.minAccuracy && gameResult.accuracy < ach.minAccuracy) qualified = false;
      
      // minGame logic would require counting games in a GameRepository
      // if (ach.minGame && totalGames < ach.minGame) qualified = false;

      if (qualified) {
        const newUserAch = new UserAchievementEntity({
          userId,
          achievementId: ach.id!,
          unlockedAt: new Date(),
        });

        await this._userAchievementRepository.create(newUserAch);
        newlyEarned.push(achievementToResponseDTO(ach));
      }
    }

    return newlyEarned;
  }
}
