import { IGetLeaderboardUseCase } from "../../interfaces/user/leaderboard/get-leaderboard.interface";
import { IStatsRepository } from "../../../../domain/interfaces/repository/user/stats-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { LeaderboardDTO } from "../../../DTOs/user/leaderboard.dto";
import { leaderboardMapper } from "../../../mappers/user/leaderboard.mapper";

export class GetLeaderboardUseCase implements IGetLeaderboardUseCase {
  constructor(
    private readonly _statsRepository: IStatsRepository,
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(filter: string, limit: number): Promise<LeaderboardDTO[]> {
    let sortBy = "totalScore";
    if (filter === "weekly") sortBy = "weeklyScore";
    if (filter === "monthly") sortBy = "monthlyScore";

    const stats = await this._statsRepository.getGlobalLeaderboard(sortBy, limit);

    const leaderboard: LeaderboardDTO[] = await Promise.all(
      stats.map(async (stat) => {
        const user = await this._userRepository.findById(stat.getUserId());
        return leaderboardMapper(
          stat,
          user?.name || "Unknown",
          user?.imageUrl || "",
        );
      }),
    );

    return leaderboard;
  }
}
