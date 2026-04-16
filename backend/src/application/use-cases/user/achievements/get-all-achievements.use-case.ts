import { IAchievementRepository } from "../../../../domain/interfaces/repository/user/achievement-repository.interface";
import { UserAchievementDTO } from "../../../DTOs/user/achievement.dto";
import { achievementUserMapper } from "../../../mappers/user/achievement.mapper";
import { IUserAchievementRepository } from "../../../../domain/interfaces/repository/user/user-achievement-repository.interface";

export interface IGetAllAchievementsUseCase {
    execute(userId: string): Promise<UserAchievementDTO[]>;
}

export class GetAllAchievementsUseCase implements IGetAllAchievementsUseCase {
    constructor(
        private readonly _achievementRepo: IAchievementRepository,
        private readonly _userAchievementRepo: IUserAchievementRepository,
    ) {}

    async execute(userId: string): Promise<UserAchievementDTO[]> {
            const achievements = await this._achievementRepo.find();
            const acheivmentsMap = await Promise.all(
                achievements.map(async (achievement) => {
                    const userAchievement = await this._userAchievementRepo.findOne({ achievementId: achievement.getId(), userId });
                    return achievementUserMapper({
                        id: achievement.getId() || "",
                        title: achievement.getTitle(),
                        description: achievement.getDescription(),
                        imageUrl: achievement.getImageUrl(),
                        minWpm: achievement.getMinWpm(),
                        minAccuracy: achievement.getMinAccuracy(),
                        minGame: achievement.getMinGame(),
                        xp: achievement.getXp(),
                        isUnlocked: !!userAchievement,
                    });
                })
            )
            console.log("achievements", acheivmentsMap);
            return acheivmentsMap;
       
    }
}