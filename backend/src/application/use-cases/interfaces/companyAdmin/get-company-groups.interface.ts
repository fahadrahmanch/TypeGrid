import { CompanyGroupDTO } from '../../../DTOs/companyAdmin/company-group.dto';

export interface IGetCompanyGroupsUseCase {
  execute(userId: string): Promise<CompanyGroupDTO[]>;
}
