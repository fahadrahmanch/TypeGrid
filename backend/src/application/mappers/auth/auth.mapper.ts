import { IUser } from '../../use-cases/interfaces/user/user.interface';

export const mapToSafeUser = (user: IUser) => {
  const { password: _, ...safeUser } = user;
  return safeUser;
};
