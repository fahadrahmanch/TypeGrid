import { Model } from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { ICompanyChallengeRepository } from "../../../../domain/interfaces/repository/company/company-challenge-repository.interface";
import { ICompanyChallengeDocument } from "../../types/documents";

export class CompanyChallengeRepository
  extends BaseRepository<ICompanyChallengeDocument>
  implements ICompanyChallengeRepository
{
  constructor(model: Model<ICompanyChallengeDocument>) {
    super(model);
  }
}
