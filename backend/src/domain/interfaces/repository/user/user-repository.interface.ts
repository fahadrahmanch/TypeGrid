import { UserEntity } from "../../../entities/user.entity";

export interface IUserRepository {
  create(data: any): Promise<UserEntity>;
  // findByEmail(email: string): Promise<UserEntity | null>;
  findById(
    id: string,
    options?: {
      populate?: any;
    },
  ): Promise<UserEntity | null>;
  update(data: any): Promise<UserEntity | null>;
  find(
    filter?: any,
    options?: {
      populate?: { path: string; select?: string };
    },
  ): Promise<UserEntity[]>;
  // FindByEmail(email: string): Promise<UserEntity | null>;
  findOne(filter?: any): Promise<UserEntity | null>;
  delete(_id: string): Promise<UserEntity | null>;
  updateById(_id: string, updateQuery: any): Promise<UserEntity | null>;
  getCompanyUsers(search:string,companyId:string): Promise<UserEntity[]>;
}
