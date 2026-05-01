import { DailyAssignChallengeResponseDTO } from "../../../DTOs/admin/daily-challenge.dto";

export interface IUpdateDailyAssignChallengeUseCase {
  execute(id: string, data: { challengeId?: string; date?: Date }): Promise<DailyAssignChallengeResponseDTO | null>;
}
