import { ICompanyGroupRepository } from "../../../../domain/interfaces/repository/company/company-group-repository.interface";
import { Model } from "mongoose";
import mongoose from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { ICompanyGroupDocument } from "../../types/documents";
import { CompanyGroupEntity } from "../../../../domain/entities/company-group.entity";
import { CompanyGroupMapper } from "../../mappers/company-group.mapper";

export class CompanyGroupRepositroy
  extends BaseRepository<ICompanyGroupDocument, CompanyGroupEntity>
  implements ICompanyGroupRepository
{
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
}