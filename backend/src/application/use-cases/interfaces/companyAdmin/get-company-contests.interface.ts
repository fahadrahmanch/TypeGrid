import { ContestProps } from '../../../DTOs/companyAdmin/company-contest.dto';
export interface IGetCompanyContestsUsecase {
  execute(userId: string): Promise<ContestProps[]>;
}
