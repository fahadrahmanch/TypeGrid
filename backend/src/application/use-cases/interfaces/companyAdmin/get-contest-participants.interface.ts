import { ParticipantsDTO } from "../../../DTOs/companyAdmin/company-contest.dto";
export interface IGetContestParticipantsUseCase {
  execute(contestId: string, userId: string): Promise<ParticipantsDTO[]>;
}
