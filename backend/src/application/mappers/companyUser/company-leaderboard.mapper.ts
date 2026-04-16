import { CompanyUserStatsEntity } from '../../../domain/entities';
import { CompanyLeaderboardDTO } from '../../DTOs/companyUser/company-leaderboard.dto';

export class CompanyLeaderboardMapper {
  static toDTO(entity: CompanyUserStatsEntity, userName: string, imageUrl: string): CompanyLeaderboardDTO {
    return {
      userId: entity.getUserId(),
      name: userName,
      imageUrl: imageUrl,
      wpm: entity.getWpm(),
      accuracy: entity.getAccuracy(),
      totalScore: entity.getTotalScore(),
      weeklyScore: entity.getWeeklyScore(),
      monthlyScore: entity.getMonthlyScore(),
    };
  }
}
