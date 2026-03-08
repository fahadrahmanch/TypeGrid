import { Model } from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/competition-repository.interface";
import { ICompetitionDocument } from "../../types/documents";

export class CompetitionRepository
  extends BaseRepository<ICompetitionDocument>
  implements ICompetitionRepository
{
  constructor(model: Model<ICompetitionDocument>) {
    super(model);
  }
}
