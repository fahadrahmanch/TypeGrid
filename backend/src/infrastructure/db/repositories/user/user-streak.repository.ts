import { Model } from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { IUserStreakDocument } from "../../types/documents";
import { UserStreakEntity } from "../../../../domain/entities/user-streak.entity";
import { IUserStreakRepository } from "../../../../domain/interfaces/repository/user/user-streak-repository.interface";
import { UserStreakMapper } from "../../mappers/user-streak.mapper";

export class UserStreakRepository
  extends BaseRepository<IUserStreakDocument, UserStreakEntity>
  implements IUserStreakRepository
{
  constructor(model: Model<IUserStreakDocument>) {
    super(model, UserStreakMapper.toDomain);
  }
}
