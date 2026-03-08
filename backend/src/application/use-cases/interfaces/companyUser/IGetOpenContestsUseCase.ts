import { openContestDTO } from "../../../DTOs/companyAdmin/CompanyContestDTO";
export interface IGetOpenContestsUseCase {
  execute(userId: string): Promise<openContestDTO[]>;
}
