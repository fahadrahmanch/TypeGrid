import { Model } from "mongoose";
import { BaseRepository } from "../../base/BaseRepository";
import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/ICompetitionRepository";
import { ICompetitionDocument } from "../../types/documents";

export class CompetitionRepository
  extends BaseRepository<ICompetitionDocument>
  implements ICompetitionRepository
{
  constructor(model: Model<ICompetitionDocument>) {
    super(model);
  }
}
