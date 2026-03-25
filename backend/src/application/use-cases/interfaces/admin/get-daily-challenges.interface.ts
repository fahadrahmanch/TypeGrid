import { DailyAssignChallengeResponseDTO } from "../../../DTOs/admin/daily-challenge.dto";

export interface IGetDailyAssignChallengesUseCase {
  execute(date: string, page: number, limit: number):Promise<{ dailyChallenges: DailyAssignChallengeResponseDTO[]; total: number }>;
}
