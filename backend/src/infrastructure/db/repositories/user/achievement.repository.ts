import { Model } from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { IAchievementRepository } from "../../../../domain/interfaces/repository/user/achievement-repository.interface";
import { IAchievementDocument } from "../../types/documents";
import { AchievementEntity } from "../../../../domain/entities/achievement.entity";
import { AchievementMapper } from "../../mappers/achievement.mapper";

export class AchievementRepository
  extends BaseRepository<IAchievementDocument, AchievementEntity>
  implements IAchievementRepository
{
  constructor(model: Model<IAchievementDocument>) {
    super(model, AchievementMapper.toDomain);
  }

  async findByUserId(userId: string): Promise<AchievementEntity[]> {
  
    const achievements = await this.model
      .find()
      .lean<IAchievementDocument[]>()
      .exec();
    return achievements.map((achievement) => AchievementMapper.toDomain(achievement));
  }

  async findEligible(criteria: { wpm: number; accuracy: number; totalGamesPlayed: number }) {
    const achievements = await this.model.find({
      $and: [
        { $or: [{ minWpm: null }, { minWpm: { $exists: false } }, { minWpm: { $lte: criteria.wpm } }] },
        { $or: [{ minAccuracy: null }, { minAccuracy: { $exists: false } }, { minAccuracy: { $lte: criteria.accuracy } }] },
        { $or: [{ minGame: null }, { minGame: { $exists: false } }, { minGame: { $lte: criteria.totalGamesPlayed } }] },
      ],
    });

    return achievements.map((a) => AchievementMapper.toDomain(a));
  }

  async findAchievements(search: string, limit: number, page: number): Promise<{ achievements: AchievementEntity[]; total: number }> {
    const filter = search
      ? { title: { $regex: search, $options: "i" } }
      : {};

    const [docs, total] = await Promise.all([
      this.model
        .find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<IAchievementDocument[]>()
        .exec(),
      this.model.countDocuments(filter).exec(),
    ]);

    return {
      achievements: docs.map((doc) => AchievementMapper.toDomain(doc)),
      total,
    };
  }
}
