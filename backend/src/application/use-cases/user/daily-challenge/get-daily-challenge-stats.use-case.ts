import { DailyChallengeStatsDTO } from "../../../DTOs/user/daily-challenge-stats.dto";
import { IGetDailyChallengeStatsUseCase } from "../../interfaces/user/daily-challenge/get-daily-challenge-stats.interface";
import { IDailyChallengeProgressRepository } from "../../../../domain/interfaces/repository/user/daily-challenge-progress-repository.interface";
import { IUserStreakRepository } from "../../../../domain/interfaces/repository/user/user-streak-repository.interface";
import { IDailyAssignChallengeRepository } from "../../../../domain/interfaces/repository/admin/daily-challenge-repository.interface";

export class GetDailyChallengeStatsUseCase implements IGetDailyChallengeStatsUseCase {
  constructor(
    private readonly _dailyChallengeProgressRepository: IDailyChallengeProgressRepository,
    private readonly _userStreakRepository: IUserStreakRepository,
    private readonly _dailyChallengeRepository: IDailyAssignChallengeRepository,
  ) { }

  async execute(userId: string): Promise<DailyChallengeStatsDTO> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const monthProgress = await this._dailyChallengeProgressRepository.find({
      userId,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const streak = await this._userStreakRepository.findOne({ userId });

    const totalCompletedCount = await this._dailyChallengeProgressRepository.find({
      userId,
      status: "completed"
    });

    const monthCompleted = monthProgress.filter(p => p.getStatus() === "completed").length;
    const monthTarget = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    const weeklyProgress = monthProgress.filter(p => {
      const pDate = new Date(p.getDate());
      return pDate >= startOfWeek && pDate <= endOfWeek;
    });
    const completedSessions = weeklyProgress.filter(p => p.getStatus() === "completed").length;

    const calendarData: { [key: string]: "completed" | "missed" } = {};

    const formatDate = (date: Date) => {
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    monthProgress.forEach(p => {
      const dateStr = formatDate(p.getDate());
      const status = p.getStatus();
      if (status === "completed") {
        calendarData[dateStr] = "completed";
      } else if(status==='failed'){
        calendarData[dateStr] = "missed";
      }
    });

    const monthChallenges = await this._dailyChallengeRepository.find({
      date: { $gte: startOfMonth, $lte: today }
    });

    monthChallenges.forEach(c => {
      const dateStr = formatDate(c.getDate());
      if (!calendarData[dateStr]) {
        calendarData[dateStr] = "missed";
      }
    });

    const currentStreak = streak ? streak.getCurrentStreak() : 0;
    const milestones = [5, 10, 15, 20, 25, 30, 50, 75, 100];
    const nextMilestone = milestones.find(m => m > currentStreak) || (Math.ceil((currentStreak + 1) / 10) * 10);

    return {
      calendarData,
      streakTracker: {
        currentStreak,
        nextMilestone
      },
      weeklyGoal: {
        completedSessions,
        targetSessions: 7
      },
      statistics: {
        longestStreak: streak ? streak.getLongestStreak() : 0,
        totalCompleted: totalCompletedCount.length,
        monthCompleted,
        monthTarget
      }
    };
  }
}
