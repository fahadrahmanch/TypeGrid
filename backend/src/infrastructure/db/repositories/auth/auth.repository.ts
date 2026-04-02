import { User } from "../../models/user/user.schema";
import { IAuthRepository } from "../../../../domain/interfaces/repository/user/auth-repository.interface";
import { BaseRepository } from "../../base/base.repository";
import { IUserDocument } from "../../types/documents";
import AuthUserEntity from "../../../../domain/entities/auth-user.entity";
import { AuthMapper } from "../../mappers/auth.mapper";
import { Status } from "../../../../domain/enums/status.enum";

export class AuthRepository
  extends BaseRepository<IUserDocument, AuthUserEntity>
  implements IAuthRepository
{
  constructor() {
    super(User, AuthMapper.toDomain);
  }
  async findByEmail(email: string): Promise<AuthUserEntity | null> {
    const doc = await this.model
      .findOne({ email })
      .lean<IUserDocument>()
      .exec();
    return doc ? this.toDomain(doc) : null;
  }

  async getUsers(
    search: string,
    status: string,
    page: number,
    limit: number,
  ): Promise<{ users: AuthUserEntity[]; total: number }> {
    let query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: "^" + search, $options: "i" } },
        { email: { $regex: "^" + search, $options: "i" } },
      ];
    }
    if (status && status !== Status.ALL) {
      query.status = status === "Block" ? "block" : "active";
    }

    const total = await this.model.countDocuments(query);

    const rawUsers = await this.model
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<IUserDocument[]>()
      .exec();

    const users = rawUsers.map((doc) => this.toDomain(doc));

    return { users, total };
  }
}
