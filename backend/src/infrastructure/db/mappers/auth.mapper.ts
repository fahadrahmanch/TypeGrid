import { IUserDocument } from "../types/documents";
import AuthUserEntity from "../../../domain/entities/auth-user.entity";

export class AuthMapper {
  static toDomain(doc: IUserDocument): AuthUserEntity {
    return new AuthUserEntity({
      ...doc,
      _id: doc?._id?.toString(),
      CompanyId: doc?.CompanyId?.toString() ?? undefined,
      CompanyRole: doc?.CompanyRole ?? undefined,
    });
  }
}
