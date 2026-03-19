import { Model } from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { ICompanyChallengeRepository } from "../../../../domain/interfaces/repository/company/company-challenge-repository.interface";
import { ICompanyChallengeDocument } from "../../types/documents";
import { CompanyChallengeEntity } from "../../../../domain/entities/company-challenge.entity";
import { CompanyChallengeMapper } from "../../mappers/company-challenge.mapper";
export class CompanyChallengeRepository
  extends BaseRepository<ICompanyChallengeDocument, CompanyChallengeEntity>
  implements ICompanyChallengeRepository
{
  constructor(model: Model<ICompanyChallengeDocument>) {
    super(model, CompanyChallengeMapper.toDomain);
  }
}
