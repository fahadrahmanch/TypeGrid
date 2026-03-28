import { Model } from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { IStreakDocument } from "../../types/documents";
import { StreakEntity } from "../../../../domain/entities/streak.entity";
import { IStreakRepository } from "../../../../domain/interfaces/repository/user/streak-repository.interface";
import { StreakMapper } from "../../mappers/streak.mapper";

export class StreakRepository
  extends BaseRepository<IStreakDocument, StreakEntity>
  implements IStreakRepository {
  constructor(model: Model<IStreakDocument>) {
    super(model, StreakMapper.toDomain);
  }
}
