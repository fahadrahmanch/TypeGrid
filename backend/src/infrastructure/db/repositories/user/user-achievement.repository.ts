import { Model } from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { IUserAchievementDocument } from "../../types/documents";
import { UserAchievementEntity } from "../../../../domain/entities/user-achievement.entity";
import { IUserAchievementRepository } from "../../../../domain/interfaces/repository/user/user-achievement-repository.interface";
import { UserAchievementMapper } from "../../mappers/user-achievement.mapper";

export class UserAchievementRepository extends BaseRepository<IUserAchievementDocument, UserAchievementEntity> implements IUserAchievementRepository {
  constructor(private readonly _userAchievementModel: Model<IUserAchievementDocument>) {
    super(_userAchievementModel, UserAchievementMapper.toDomain);
  }

  async findByUserId(userId: string): Promise<UserAchievementEntity[]> {
    const docs = await this._userAchievementModel.find({ userId });
    return docs.map(doc => UserAchievementMapper.toDomain(doc));
  }
}
