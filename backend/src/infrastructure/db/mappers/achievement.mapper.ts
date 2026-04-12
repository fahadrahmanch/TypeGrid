import { IUserAchievementDocument } from "../types/documents";
import { AchievementEntity } from "../../../domain/entities/achievement.entity";

export class AchievementMapper {
  static toDomain(doc: IUserAchievementDocument): AchievementEntity {
    return new AchievementEntity({
      _id: doc._id?.toString(),
      userId: doc.userId.toString(),
      achievementId: doc.achievementId,
      unlockedAt: doc.unlockedAt,
    });
  }
}
