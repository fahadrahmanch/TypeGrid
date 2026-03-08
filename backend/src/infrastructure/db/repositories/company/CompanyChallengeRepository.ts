import { Model } from "mongoose";
import { BaseRepository } from "../../base/BaseRepository";
import { ICompanyChallengeRepository } from "../../../../domain/interfaces/repository/company/ICompanyChallengeRepository";
import { ICompanyChallengeDocument } from "../../types/documents";

export class CompanyChallengeRepository
  extends BaseRepository<ICompanyChallengeDocument>
  implements ICompanyChallengeRepository
{
  constructor(model: Model<ICompanyChallengeDocument>) {
    super(model);
  }
}
