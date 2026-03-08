import { ContestProps } from "../../../DTOs/companyAdmin/CompanyContestDTO";
export interface IGetContestUseCase {
  execute(contestId: string, userId: string): Promise<ContestProps>;
}
