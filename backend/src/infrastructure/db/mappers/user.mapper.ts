import { IUserDocument } from "../types/documents";
import { UserEntity } from "../../../domain/entities";

export class UserMapper {
  static toDomain(doc: IUserDocument): UserEntity {
    return new UserEntity({
      ...doc,
      _id: doc?._id?.toString(),
      CompanyId: doc?.CompanyId?.toString() ?? undefined,
      CompanyRole: doc?.CompanyRole ?? undefined,
    });
  }
}
