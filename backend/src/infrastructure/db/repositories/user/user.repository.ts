import { Model } from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { IUserDocument } from "../../types/documents";

export class UserRepository
  extends BaseRepository<IUserDocument>
  implements IUserRepository
{
  constructor(model: Model<IUserDocument>) {
    super(model);
  }
}
