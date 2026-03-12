import { UserDTO } from "../../DTOs/admin/user-management.dto";
import { IUserDocument } from "../../../infrastructure/db/types/documents";

export const mapUserToDTO = (user: IUserDocument): UserDTO => ({
  _id: user._id?.toString(),
  name: user.name,
  email: user.email,
  imageUrl: user.imageUrl,
  bio: user.bio,
  age: user.age,
  number: user.number,
  KeyBoardLayout: user.KeyBoardLayout,
  status: user.status,
  contactNumber: user.contactNumber,
  gender: user.gender,
  role: user.role,
});