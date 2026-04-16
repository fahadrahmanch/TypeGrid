import { openContestDTO } from '../../../DTOs/companyAdmin/company-contest.dto';
export interface IJoinOrLeaveContestUseCase {
  execute(userId: string, contestId: string, action: string): Promise<openContestDTO>;
}
