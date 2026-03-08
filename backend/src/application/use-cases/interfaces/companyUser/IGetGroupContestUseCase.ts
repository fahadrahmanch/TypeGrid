import { groupContestDTO } from "../../../DTOs/companyAdmin/CompanyContestDTO";
export interface IGetGroupContestsUseCase {
  execute(userId: string): Promise<groupContestDTO[] | null>;
}
