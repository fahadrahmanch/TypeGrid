import { Model } from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { IDailyChallengeProgressDocument } from "../../types/documents";
import { DailyChallengeProgressEntity } from "../../../../domain/entities/daily-challenge-progress.entity";
import { IDailyChallengeProgressRepository } from "../../../../domain/interfaces/repository/user/daily-challenge-progress-repository.interface";
import { DailyChallengeProgressMapper } from "../../mappers/daily-challenge-progress.mapper";

export class DailyChallengeProgressRepository
  extends BaseRepository<IDailyChallengeProgressDocument, DailyChallengeProgressEntity>
  implements IDailyChallengeProgressRepository
{
  constructor(model: Model<IDailyChallengeProgressDocument>) {
    super(model, DailyChallengeProgressMapper.toDomain);
  }
}
