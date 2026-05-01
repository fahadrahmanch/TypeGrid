import { AnotherUserProfileDTO } from "../../DTOs/user/another-user-profile.dto";
import { IGetAnotherUserProfileUseCase } from "../interfaces/user/get-another-user-profile.interface";
import { IUserRepository } from "../../../domain/interfaces/repository/user/user-repository.interface";
import { IStatsRepository } from "../../../domain/interfaces/repository/user/stats-repository.interface";
import { IDiscussionRepository } from "../../../domain/interfaces/repository/user/discussion-repository.interface";
import { IUserAchievementRepository } from "../../../domain/interfaces/repository/user/user-achievement-repository.interface";
import { IAchievementRepository } from "../../../domain/interfaces/repository/user/achievement-repository.interface";
import { mapToAnotherUserProfileDTO } from "../../mappers/user/user.mapper";

export class GetAnotherUserProfileUseCase implements IGetAnotherUserProfileUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _statsRepository: IStatsRepository,
    private _discussionRepository: IDiscussionRepository,
    private _userAchievementRepository: IUserAchievementRepository,
    private _achievementRepository: IAchievementRepository
  ) {}

  async execute(userId: string, requesterRole: string): Promise<AnotherUserProfileDTO | null> {
    const user = await this._userRepository.findById(userId);
    if (!user) return null;

    if ((user.role === "admin" || user.status === "block") && requesterRole !== "admin") {
      return null;
    }

    const [stats, discussions, userAchievements] = await Promise.all([
      this._statsRepository.findByUserId(userId),
      this._discussionRepository.findByUserId(userId),
      this._userAchievementRepository.findByUserId(userId),
    ]);

    const achievementsWithDetails = await Promise.all(
      userAchievements.map(async (ua) => {
        const achievement = await this._achievementRepository.findById(ua.achievementId);
        return {
          name: achievement?.getTitle() || "Unknown Achievement",
          icon: achievement?.getImageUrl() || "",
          unlockedAt: ua.unlockedAt,
        };
      })
    );

    return mapToAnotherUserProfileDTO(user, stats, discussions, achievementsWithDetails);
  }
}
