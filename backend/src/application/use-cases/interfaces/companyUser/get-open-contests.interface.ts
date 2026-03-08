import { openContestDTO } from "../../../DTOs/companyAdmin/company-contest.dto";
export interface IGetOpenContestsUseCase {
  execute(userId: string): Promise<openContestDTO[]>;
}
