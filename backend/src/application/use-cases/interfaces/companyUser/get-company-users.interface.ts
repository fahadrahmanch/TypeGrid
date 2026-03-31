import { companyUserDTO } from "../../../DTOs/companyUser/company-user.dto";
export interface IGetCompanyUsersUseCase {
  execute(userId: string,search:string): Promise<companyUserDTO[]>;
}
