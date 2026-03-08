import { ContestProps } from "../../../DTOs/companyAdmin/company-contest.dto";
export interface IGetContestUseCase {
  execute(contestId: string, userId: string): Promise<ContestProps>;
}
