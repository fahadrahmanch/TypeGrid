import { StatsEntity } from "../../../domain/entities/stats.entity";
import { LeaderboardDTO } from "../../DTOs/user/leaderboard.dto";

export function leaderboardMapper(
  stats: StatsEntity,
  name: string,
  imageUrl: string,
): LeaderboardDTO {
  return {
    userId: stats.getUserId(),
    name,
    imageUrl,
    wpm: stats.getWpm(),
    accuracy: stats.getAccuracy(),
    totalScore: stats.getTotalScore(),
    weeklyScore: stats.getWeeklyScore(),
    monthlyScore: stats.getMonthlyScore(),
    totalCompetitions: stats.getTotalCompetitions(),
    level: stats.getLevel(),
  };
}
