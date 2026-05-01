import { DailyAssignChallengeResponseDTO } from "../../../DTOs/admin/daily-challenge.dto";

export interface IGetDailyAssignChallengeUseCase {
  execute(id: string): Promise<DailyAssignChallengeResponseDTO | null>;
}
