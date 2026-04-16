import { companyUserDTO } from '../../DTOs/companyUser/company-user.dto';

export type CompanyUserPayload = {
  _id?: any;
  name?: string;
  email?: string;
  imageUrl?: string;
  number?: string;
  bio?: string;
  CompanyRole?: string;
};

export const mapCompanyUsersWithOnlineStatus = async (
  users: CompanyUserPayload[],
  onlineUsers: string[]
): Promise<companyUserDTO[]> => {
  const onlineUsersSet = new Set(onlineUsers);

  return users.map((user) => ({
    _id: user._id!.toString(),
    name: user.name || '',
    email: user.email || '',
    imageUrl: user.imageUrl || '',
    number: user.number || '',
    bio: user.bio || '',
    companyRole: user.CompanyRole || '',
    online: onlineUsersSet.has(user._id!.toString()),
  }));
};
