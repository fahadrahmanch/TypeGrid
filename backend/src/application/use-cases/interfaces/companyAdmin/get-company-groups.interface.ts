import { CompanyGroupDTO } from "../../../DTOs/companyAdmin/company-group.dto";

export interface IGetCompanyGroupsUseCase {
  execute(userId: string, search?: string, limit?: string, page?: string): Promise<{ groups: CompanyGroupDTO[]; totalPages: number }>;
}
