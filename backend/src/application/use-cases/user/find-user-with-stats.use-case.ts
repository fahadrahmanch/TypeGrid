import { IFindUserWithStatsUseCase } from "../interfaces/user/find-user-with-stats.interface";
import { IAuthRepository } from "../../../domain/interfaces/repository/user/auth-repository.interface";
import { AuthUserEntity } from "../../../domain/entities";
import { IStatsRepository } from "../../../domain/interfaces/repository/user/stats-repository.interface";
import { StatsEntity } from "../../../domain/entities/stats.entity";

export class FindUserWithStatsUseCase implements IFindUserWithStatsUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private statsRepository: IStatsRepository
  ) {}

  async execute(email: string): Promise<{ user: AuthUserEntity | null, stats: StatsEntity | null }> {
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      return { user: null, stats: null };
    }

    const stats = await this.statsRepository.findByUserId(user._id as string);
    return { user, stats };
  }
}
