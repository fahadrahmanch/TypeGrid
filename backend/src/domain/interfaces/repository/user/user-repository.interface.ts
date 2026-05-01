import { UserEntity } from "../../../entities/user.entity";
import { IBaseRepository } from "../base-repository.interface";
export interface IUserRepository extends IBaseRepository<UserEntity> {
  getCompanyUsers(search: string, companyId: string, page?: number, limit?: number): Promise<{ users: UserEntity[]; total: number }>;
}
