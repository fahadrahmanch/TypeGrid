import { CompanyGroupDetailsDTO } from '../../../DTOs/companyAdmin/company-group-details.dto';

export interface IGetCompanyGroupByIdUseCase {
  execute(groupId: string, userId: string): Promise<CompanyGroupDetailsDTO | null>;
}
