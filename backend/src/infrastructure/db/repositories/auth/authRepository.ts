import { User } from "../../models/user/userSchema";
import { IAuthRepostory } from "../../../../domain/interfaces/repository/user/IAuthRepository";
import { BaseRepository } from "../../base/BaseRepository";
import { IUserDocument } from "../../types/documents";

export class authRepository
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
