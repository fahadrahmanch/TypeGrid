import { Model } from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/competition-repository.interface";
import { ICompetitionDocument } from "../../types/documents";
import { CompetitionEntity } from "../../../../domain/entities/competition.entity";
import { CompetitionMapper } from "../../mappers/competition.mapper";

export class CompetitionRepository
  extends BaseRepository<ICompetitionDocument, CompetitionEntity>
  implements ICompetitionRepository
{
  constructor(model: Model<ICompetitionDocument>) {
    super(model, CompetitionMapper.toDomain);
  }
}
