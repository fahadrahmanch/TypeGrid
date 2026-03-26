import { DailyAssignChallengeEntity } from "../../../../domain/entities/daily-challenge.entity";
import { IBaseRepository } from "../base-repository.interface";

export interface IDailyAssignChallengeRepository extends IBaseRepository<DailyAssignChallengeEntity> {
  getDailyAssignChallenges(date: string, page: number, limit: number): Promise<{ dailyChallenges: DailyAssignChallengeEntity[]; total: number }>;
  getTodayChallenge(startOfDay: Date, endOfDay: Date): Promise<DailyAssignChallengeEntity | null>;
}
