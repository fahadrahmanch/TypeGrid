import { IAchievementDocument } from "../types/documents";
import { AchievementEntity } from "../../../domain/entities/achievement.entity";

export class AchievementMapper {
  static toDomain(doc: IAchievementDocument): AchievementEntity {
    return new AchievementEntity({
      _id: doc._id?.toString(),
      title: doc.title,
      description: doc.description,
      imageUrl: doc.imageUrl,
      minWpm: doc.minWpm,
      minAccuracy: doc.minAccuracy,
      minGame: doc.minGame,
      xp: doc.xp,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
