import { Model } from "mongoose";
import { BaseRepository } from "../../base/BaseRepository";
import { IGroupRepository } from "../../../../domain/interfaces/repository/user/IGroupRepository";
import { IGroupDocument } from "../../types/documents";

export class GroupRepository
  extends BaseRepository<IGroupDocument>
  implements IGroupRepository
{
  constructor(model: Model<IGroupDocument>) {
    super(model);
  }
}
