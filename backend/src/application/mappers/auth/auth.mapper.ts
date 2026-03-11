import { IUser } from "../../use-cases/interfaces/user/user.interface";

export const mapToSafeUser = (user: IUser) => {
  const { password, ...safeUser } = user;
  return safeUser;
};
