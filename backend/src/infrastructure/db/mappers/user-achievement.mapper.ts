import { IUserAchievementDocument } from "../types/documents";
import { UserAchievementEntity } from "../../../domain/entities/user-achievement.entity";

export class UserAchievementMapper {
  static toDomain(doc: IUserAchievementDocument): UserAchievementEntity {
    return new UserAchievementEntity({
      _id: doc._id?.toString(),
      userId: doc.userId.toString(),
      achievementId: doc.achievementId.toString(),
      unlockedAt: doc.unlockedAt,
    });
  }
}
