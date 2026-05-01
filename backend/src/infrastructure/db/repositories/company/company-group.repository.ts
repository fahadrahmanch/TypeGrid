import { ICompanyGroupRepository } from "../../../../domain/interfaces/repository/company/company-group-repository.interface";
import { Model } from "mongoose";
import mongoose from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { ICompanyGroupDocument } from "../../types/documents";
import { CompanyGroupEntity } from "../../../../domain/entities/company-group.entity";
import { CompanyGroupMapper } from "../../mappers/company-group.mapper";

export class CompanyGroupRepository
  extends BaseRepository<ICompanyGroupDocument, CompanyGroupEntity>
  implements ICompanyGroupRepository {
  constructor(model: Model<ICompanyGroupDocument>) {
    super(model, CompanyGroupMapper.toDomain);
  }

  async getGroup(userId: string): Promise<CompanyGroupEntity[]> {
    const docs = await this.model
      .find({ members: new mongoose.Types.ObjectId(userId) }, { _id: 1 })
      .lean<ICompanyGroupDocument[]>()
      .exec();
    return docs.map(CompanyGroupMapper.toDomain);
  }
  async allGroups(companyId: string, search?: string, limit: string = "10", page: string = "1"): Promise<{ groups: CompanyGroupEntity[]; totalPages: number }> {
    const query: any = { companyId: new mongoose.Types.ObjectId(companyId) };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const nLimit = Math.max(1, Number(limit) || 10);
    const nPage = Math.max(1, Number(page) || 1);
    const skip = (nPage - 1) * nLimit;
    const docs = await this.model
      .find(query)
      .limit(nLimit)
      .skip(skip)
      .lean<ICompanyGroupDocument[]>()
      .exec();

    const total = await this.model.countDocuments(query);
    const totalPages = Math.ceil(total / nLimit);
    const groups = docs.map(CompanyGroupMapper.toDomain);
    return { groups, totalPages };
  }
}
