import { Model } from "mongoose";
import { BaseRepository } from "../../base/BaseRepository";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/IUserRepository";
import { IUserDocument } from "../../types/documents";

export class UserRepository
  extends BaseRepository<IUserDocument>
  implements IUserRepository
{
  constructor(model: Model<IUserDocument>) {
    super(model);
  }
}
