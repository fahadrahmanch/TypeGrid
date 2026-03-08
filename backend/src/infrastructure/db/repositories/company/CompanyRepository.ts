import { Model } from "mongoose";
import { BaseRepository } from "../../base/BaseRepository";
import { ICompanyRepository } from "../../../../domain/interfaces/repository/company/ICompanyRepository";
import { ICompanyDocument } from "../../types/documents";

export class CompanyRepository
  extends BaseRepository<ICompanyDocument>
  implements ICompanyRepository
{
  constructor(model: Model<ICompanyDocument>) {
    super(model);
  }
}
