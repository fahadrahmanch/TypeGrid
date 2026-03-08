import { ContestProps } from "../../../DTOs/companyAdmin/CompanyContestDTO";
export interface IGetCompanyContestsUsecase {
  execute(userId: string): Promise<ContestProps[]>;
}
