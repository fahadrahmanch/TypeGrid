import { CompanyGroupMemberDTO } from "../../../DTOs/companyAdmin/company-group-details.dto";

export interface IGetCompanyUsersWithStatusUseCase {
  execute(CompanyId: string): Promise<CompanyGroupMemberDTO[]>;
}
