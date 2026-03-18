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
  async getCompanies(
    status: string,
    searchText: string,
    page: number,
    limit: number,
  ): Promise<{ companies: ICompanyDocument[]; total: number }> {
    let query: any = {};

    if (searchText) {
      query.$or = [
        { companyName: { $regex: "^" + searchText, $options: "i" } },
        { email: { $regex: "^" + searchText, $options: "i" } },
      ];
    }

    if (status && status !== "All") {
      query.status = status.toLowerCase();
    }

    const total = await this.model.countDocuments(query);

    const companies = await this.model
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<ICompanyDocument[]>()
      .exec();

    return { companies, total };
  }
}
