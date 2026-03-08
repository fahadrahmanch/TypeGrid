import { User } from "../../models/user/user.schema";
import { IAuthRepostory } from "../../../../domain/interfaces/repository/user/auth-repository.interface";
import { BaseRepository } from "../../base/base.repository";
import { IUserDocument } from "../../types/documents";

export class AuthRepository
  extends BaseRepository<IUserDocument>
  implements IAuthRepostory
{
  constructor() {
    super(User);
  }
  async findByEmail(email: string): Promise<IUserDocument | null> {
    return await User.findOne({ email }).lean<IUserDocument>().exec();
  }
}
