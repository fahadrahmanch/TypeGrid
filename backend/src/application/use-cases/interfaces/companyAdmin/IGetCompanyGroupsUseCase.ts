import { CompanyGroupDTO } from "../../../DTOs/companyAdmin/companyGroupDTO";

export interface IGetCompanyGroupsUseCase {
    execute(userId: string): Promise<CompanyGroupDTO[]>;
}