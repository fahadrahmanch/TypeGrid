import { CompanyGroupDTO } from "../../../DTOs/companyAdmin/company-group.dto";

export interface ICreateCompanyGroupUseCase {
  execute(groupData: CompanyGroupDTO, userId: string): Promise<void>;
}
