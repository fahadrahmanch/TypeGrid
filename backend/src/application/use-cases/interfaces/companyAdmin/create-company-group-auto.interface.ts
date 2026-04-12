import { CreateCompanyGroupAutoDTO } from "../../../DTOs/companyAdmin/create-company-group-auto.dto";

export interface ICreateCompanyGroupAutoUseCase {
    execute(groupData: CreateCompanyGroupAutoDTO, userId: string): Promise<void>;
}