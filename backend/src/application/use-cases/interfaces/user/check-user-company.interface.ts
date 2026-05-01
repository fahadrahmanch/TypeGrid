import { CompanyDTO } from "../../../DTOs/user/company.dto";

export interface ICheckUserCompanyUseCase {
  execute(userId: string): Promise<CompanyDTO | null>;
}
