import { Model } from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { IUserDocument } from "../../types/documents";
import { UserEntity } from "../../../../domain/entities/user.entity";
import { UserMapper } from "../../mappers/user.mapper";

export class UserRepository extends BaseRepository<IUserDocument, UserEntity> implements IUserRepository {
  constructor(model: Model<IUserDocument>) {
    super(model, UserMapper.toDomain);
  }
  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.model.findOne({ email });
    return user ? UserMapper.toDomain(user) : null;
  }
  async getCompanyUsers(search: string, companyId: string, page: number, limit: number): Promise<{ users: UserEntity[]; total: number }> {
    const query = {
      name: { $regex: "^" + search, $options: "i" },
      CompanyId: companyId,
      role: "companyUser",
    };

    const [users, total] = await Promise.all([
      this.model
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<IUserDocument[]>()
        .exec(),
      this.model.countDocuments(query),
    ]);

    const userEntities = users.map((user) => UserMapper.toDomain(user as any));
    return { users: userEntities, total };
  }
}
