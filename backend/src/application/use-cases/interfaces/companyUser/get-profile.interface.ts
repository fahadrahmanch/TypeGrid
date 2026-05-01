import { CompanyUserProfileDTO } from "../../../DTOs/companyUser/company-user-profile.dto";

export interface IGetProfileUseCase {
  getProfile(userId: string): Promise<CompanyUserProfileDTO | null>;
}
