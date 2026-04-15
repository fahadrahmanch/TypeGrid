import { CompanyDetailsDTO } from "../../../DTOs/companyAdmin/company-details.dto";

export interface IGetCompanyDetailsUseCase {
    execute(userId: string): Promise<CompanyDetailsDTO>;
}