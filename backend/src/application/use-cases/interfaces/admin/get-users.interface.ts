import { IUser } from "../user/user.interface";
export interface IGetUsersUseCase {
  execute(): Promise<IUser[]>;
}
