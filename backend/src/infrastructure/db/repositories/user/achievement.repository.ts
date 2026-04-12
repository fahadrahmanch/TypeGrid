import { Model } from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { IAchievementRepository } from "../../../../domain/interfaces/repository/user/achievement-repository.interface";
import { IUserAchievementDocument } from "../../types/documents";
import { AchievementEntity } from "../../../../domain/entities/achievement.entity";
import { AchievementMapper } from "../../mappers/achievement.mapper";

export class AchievementRepository
  extends BaseRepository<IUserAchievementDocument, AchievementEntity>
  implements IAchievementRepository
{
  constructor(model: Model<IUserAchievementDocument>) {
    super(model, AchievementMapper.toDomain);
  }

  async findByUserId(userId: string): Promise<AchievementEntity[]> {
    const achievements = await this.model
      .find({ userId })
      .lean<IUserAchievementDocument[]>()
      .exec();
    return achievements.map((achievement) => AchievementMapper.toDomain(achievement));
  }
}
