import { AssignDailyChallengeDTO, DailyAssignChallengeResponseDTO } from "../../../DTOs/admin/daily-challenge.dto";

export interface ICreateDailyAssignChallengeUseCase {
  execute(data: AssignDailyChallengeDTO): Promise<DailyAssignChallengeResponseDTO>;
}
