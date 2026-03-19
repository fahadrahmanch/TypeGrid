import { Model } from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { IUserDocument } from "../../types/documents";
import { UserEntity } from "../../../../domain/entities/user.entity";
import { UserMapper } from "../../mappers/user.mapper";

export class UserRepository
  extends BaseRepository<IUserDocument, UserEntity>
  implements IUserRepository
{
  constructor(model: Model<IUserDocument>) {
    super(model, UserMapper.toDomain);
  }
  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.model.findOne({ email });
    return user ? UserMapper.toDomain(user) : null;
  }
}
