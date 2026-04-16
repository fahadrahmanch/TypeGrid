import { CreateContestDTO } from '../../../DTOs/companyAdmin/company-contest.dto';
export interface IUpdateContestUseCase {
  execute(constestId: string, data: CreateContestDTO): Promise<CreateContestDTO>;
}
