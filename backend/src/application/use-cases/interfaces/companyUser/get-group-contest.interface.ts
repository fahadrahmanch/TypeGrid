import { groupContestDTO } from "../../../DTOs/companyAdmin/company-contest.dto";
export interface IGetGroupContestsUseCase {
  execute(userId: string): Promise<groupContestDTO[] | null>;
}
