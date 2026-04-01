import { Model } from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { ICompanyRepository } from "../../../../domain/interfaces/repository/company/company-repository.interface";
import { ICompanyDocument } from "../../types/documents";
import { CompanyEntity } from "../../../../domain/entities";
import { CompanyMapper } from "../../mappers/company.mapper";
import { Status } from "../../../../domain/enums/status.enum";

export class CompanyRepository
  extends BaseRepository<ICompanyDocument, CompanyEntity>
  implements ICompanyRepository
{
  constructor(model: Model<ICompanyDocument>) {
    super(model, CompanyMapper.toDomain);
  }

  async getCompanies(
    status: string,
    searchText: string,
    page: number,
    limit: number,
  ): Promise<{ companies: CompanyEntity[]; total: number }> {
    let query: any = {};

    if (searchText) {
      query.$or = [
        { companyName: { $regex: "^" + searchText, $options: "i" } },
        { email: { $regex: "^" + searchText, $options: "i" } },
      ];
    }

    if (status && status !== Status.ALL) {
      query.status = status.toLowerCase();
    }

    const total = await this.model.countDocuments(query);

    const rawCompanies = await this.model
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<ICompanyDocument[]>()
      .exec();

    const companies = rawCompanies.map(doc => this.toDomain(doc));

    return { companies, total };
  }
}
