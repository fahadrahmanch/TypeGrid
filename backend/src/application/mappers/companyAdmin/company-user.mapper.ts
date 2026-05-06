import { CompanyUserManagementDTO } from "../../DTOs/companyAdmin/company-user-management.dto";
import { CompanyUserStatsEntity } from "../../../domain/entities";

export const mapCompanyUserToDTO = (user: any, stats?: CompanyUserStatsEntity): CompanyUserManagementDTO => {
 
  
  return {
    _id: user._id?.toString(),
    name: user.name,
    email: user.email,
    imageUrl: user.imageUrl,
    bio: user.bio,
    age: user.age,
    number: user.number,
    CompanyId: user.CompanyId?.toString(),
    CompanyRole: user.CompanyRole,
    KeyBoardLayout: user.KeyBoardLayout,
    status: user.status,
    contactNumber: user.contactNumber,
    gender: user.gender,
    role: user.role,
    wpm: stats?.getWpm() || 0,
    accuracy: stats?.getAccuracy() || 0,
    createdAt: user.createdAt,
  };
};
