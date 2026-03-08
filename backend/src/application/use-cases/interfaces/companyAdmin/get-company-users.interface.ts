import { IUser } from "../user/user.interface";
export interface IGetCompanyUsersUseCase {
  execute(CompanyId: string): Promise<IUser[]>;
}
