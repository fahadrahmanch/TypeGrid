import { openContestDTO } from "../../../DTOs/companyAdmin/CompanyContestDTO";
export interface IJoinOrLeaveContestUseCase {
  execute(
    userId: string,
    contestId: string,
    action: string,
  ): Promise<openContestDTO>;
}
