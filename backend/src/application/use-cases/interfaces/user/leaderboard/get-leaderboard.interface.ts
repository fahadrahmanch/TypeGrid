import { LeaderboardDTO } from '../../../../DTOs/user/leaderboard.dto';

export interface IGetLeaderboardUseCase {
  execute(filter: string, limit: number): Promise<LeaderboardDTO[]>;
}
