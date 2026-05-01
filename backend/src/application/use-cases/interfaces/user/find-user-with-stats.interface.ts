import { AuthUserEntity } from "../../../../domain/entities";
import { StatsEntity } from "../../../../domain/entities/stats.entity";

export interface IFindUserWithStatsUseCase {
  execute(email: string): Promise<{ user: AuthUserEntity | null, stats: StatsEntity | null }>;
}
