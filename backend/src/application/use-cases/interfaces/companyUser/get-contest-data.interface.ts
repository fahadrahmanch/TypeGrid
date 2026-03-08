import { ContestProps } from "../../../DTOs/companyAdmin/company-contest.dto";
export interface IGetContestDataUseCase {
  execute(contestId: string, userId: string): Promise<ContestProps>;
}
