import { ICompanyGroupRepository } from "../../../../domain/interfaces/repository/companyUser/company-group-repository.interface";
import { Model } from "mongoose";
import mongoose from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { ICompanyGroupDocument } from "../../types/documents";
export class CompanyGroupRepositroy<ICompanyGroupDocument> extends BaseRepository<ICompanyGroupDocument> implements ICompanyGroupRepository<ICompanyGroupDocument> {
  constructor(model: Model<ICompanyGroupDocument>) {
    super(model)
  }
  async getGroup(userId: string): Promise<ICompanyGroupDocument[]> {
    return this.model.find(
      {
        members: new mongoose.Types.ObjectId(userId),
      },
      { _id: 1 },
    );
  }
}
