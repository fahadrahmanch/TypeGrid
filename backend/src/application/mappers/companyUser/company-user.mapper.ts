import { IUserDocument } from "../../../infrastructure/db/types/documents";
import { companyUserDTO } from "../../DTOs/companyUser/company-user.dto";

export const mapCompanyUsersWithOnlineStatus = async (
  users: IUserDocument[],
  onlineUsers: string[],
): Promise<companyUserDTO[]> => {
  const onlineUsersSet = new Set(onlineUsers);

  return users.map((user) => ({
    _id: user._id!.toString(),
    name: user.name,
    email: user.email,
    imageUrl: user.imageUrl || "",
    number: user.number,
    bio: user.bio,
    companyRole: user.CompanyRole || undefined,
    online: onlineUsersSet.has(user._id!.toString()),
  }));
};
