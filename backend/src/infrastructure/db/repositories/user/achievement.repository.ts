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
}
