import { Model } from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { ICompanyRepository } from "../../../../domain/interfaces/repository/company/company-repository.interface";
import { ICompanyDocument } from "../../types/documents";

export class CompanyRepository
  extends BaseRepository<ICompanyDocument>
  implements ICompanyRepository
{
  constructor(model: Model<ICompanyDocument>) {
    super(model);
  }
}
