import { User } from "../../models/user/user.schema";
import { IAuthRepository } from "../../../../domain/interfaces/repository/user/auth-repository.interface";
import { BaseRepository } from "../../base/base.repository";
import { IUserDocument } from "../../types/documents";
import { AuthUserEntity } from "../../../../domain/entities";
export class AuthRepository
  extends BaseRepository<IUserDocument>
  implements IAuthRepository
{
  constructor() {
    super(User);
  }
  async findByEmail(email: string): Promise<any | null> {
    return await User.findOne({ email }).lean<any>().exec();
  }

  async getUsers(
  search: string,
  status: string,
  page: number,
  limit: number
): Promise<{users:any[],total:number}> {

  let query: any = {};

  if (search) {
    query.$or = [
      { name: { $regex: '^'+search, $options: "i" } },
      { email: { $regex: '^'+search, $options: "i" } },
    ];
  }
  if (status && status !== "All") {
    query.status = status === "Block"?"block":"active";
  }

  const total = await User.countDocuments(query);

  const users = await User.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean<IUserDocument[]>()
    .exec();

  return {users,total};
}
}
