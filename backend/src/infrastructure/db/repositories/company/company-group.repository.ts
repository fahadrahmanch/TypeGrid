import { Model, Types } from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { ICompanyGroupRepository } from "../../../../domain/interfaces/repository/company/company-group-repository.interface";
import { ICompanyGroupDocument } from "../../types/documents";

export class CompanyGroupRepository
  extends BaseRepository<ICompanyGroupDocument>
  implements ICompanyGroupRepository
{
  constructor(model: Model<ICompanyGroupDocument>) {
    super(model);
  }

  async getGroup(userId: string): Promise<ICompanyGroupDocument[]> {
    return this.model
      .find(
        {
          members: new Types.ObjectId(userId),
        },
        { _id: 1 },
      )
      .lean<ICompanyGroupDocument[]>()
      .exec();
  }
}
