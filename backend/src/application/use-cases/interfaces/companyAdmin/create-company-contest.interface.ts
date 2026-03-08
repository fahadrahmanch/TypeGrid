import { CreateContestDTO } from "../../../DTOs/companyAdmin/company-contest.dto";
export interface ICreateCompanyContestUseCase {
  execute(data: CreateContestDTO, userId: string): Promise<CreateContestDTO>;
}
