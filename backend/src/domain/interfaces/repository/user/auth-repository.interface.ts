import { IBaseRepository } from "../base-repository.interface";
import AuthUserEntity from "../../../entities/auth-user.entity";

export interface IAuthRepository extends IBaseRepository<AuthUserEntity> {
  findByEmail(email: string): Promise<AuthUserEntity | null>;
  getUsers(
    search: string,
    status: string,
    page: number,
    limit: number
  ): Promise<{ users: AuthUserEntity[]; total: number }>;
}
