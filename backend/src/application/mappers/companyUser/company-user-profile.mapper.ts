import { UserEntity } from "../../../domain/entities/user.entity";
import { CompanyUserProfileDTO } from "../../DTOs/companyUser/company-user-profile.dto";
import { formatDate } from "../../../utils/date-formatter.util";
import { calculateTier } from "../../../domain/utils/tier.util";

export const mapToCompanyUserProfileDTO = (
  user: UserEntity,
  companyName: string,
  avgSpeed: number,
  accuracy: number,
  lessonsCount: number,
): CompanyUserProfileDTO => {
  return {
    identity: {
      fullName: user.name,
      email: user.email,
      role: user.CompanyRole || "Company User",
      company: companyName,
      memberSince: formatDate(user.createdAt),
      imageUrl: user.imageUrl || "",
    },
    stats: {
      avgSpeed: avgSpeed,
      accuracy: accuracy,
      lessons: lessonsCount,
    },
    tier: calculateTier(avgSpeed),
  };
};
