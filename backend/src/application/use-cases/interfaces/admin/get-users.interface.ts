import { IUser } from "../user/user.interface";
export interface IGetUsersUseCase {
  execute(search: string, status: string, page: number, limit: number): Promise<{ users: IUser[]; total: number }>;
}
