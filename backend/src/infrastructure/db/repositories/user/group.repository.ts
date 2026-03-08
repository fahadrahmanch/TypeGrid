import { Model } from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { IGroupRepository } from "../../../../domain/interfaces/repository/user/group-repository.interface";
import { IGroupDocument } from "../../types/documents";

export class GroupRepository
  extends BaseRepository<IGroupDocument>
  implements IGroupRepository
{
  constructor(model: Model<IGroupDocument>) {
    super(model);
  }
}
