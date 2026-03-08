import { companyUserDTO } from "../../../DTOs/companyUser/companyUserDto";
export interface IGetCompanyUsers {
  execute(userId: string): Promise<companyUserDTO[]>;
}
