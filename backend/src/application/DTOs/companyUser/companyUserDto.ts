export interface companyUserDTO {
  _id: string;
  name: string;
  email: string;
  imageUrl: string;
  number?: string;
  bio?: string;
  companyRole?: string;
  online: boolean;
}
export const mapCompanyUsersWithOnlineStatus = async (
  users: any[],
  onlineUsers: string[],
): Promise<companyUserDTO[]> => {
  const onlineUsersSet = new Set(onlineUsers);

  return users.map((user) => ({
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    imageUrl: user.imageUrl,
    number: user.number,
    bio: user.bio,
    companyRole: user.companyRole,
    online: onlineUsersSet.has(user._id.toString()),
  }));
};
