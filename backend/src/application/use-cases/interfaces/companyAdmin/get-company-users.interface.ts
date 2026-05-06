import { CompanyUserManagementDTO } from "../../../DTOs/companyAdmin/company-user-management.dto";

export interface IGetCompanyUsersUseCase {
  execute(
    CompanyId: string, 
    search: string, 
    page: number, 
    limit: number
  ): Promise<{ users: CompanyUserManagementDTO[]; total: number }>;
}
