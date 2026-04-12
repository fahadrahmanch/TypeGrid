import { IDailyChallengeFinishedUseCase } from "../../interfaces/user/daily-challenge/daily-challenge-finished.interface";
import { IDailyAssignChallengeRepository } from "../../../../domain/interfaces/repository/admin/daily-challenge-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { IDailyChallengeProgressRepository } from "../../../../domain/interfaces/repository/user/daily-challenge-progress-repository.interface";
import { IChallengeRepository } from "../../../../domain/interfaces/repository/admin/challenge-repository.interface";
import { IGoalRepository } from "../../../../domain/interfaces/repository/admin/goal-repository.interface";
import { IRewardRepository } from "../../../../domain/interfaces/repository/admin/reward-repository.interface";
import { DailyChallengeProgressEntity } from "../../../../domain/entities/daily-challenge-progress.entity";
import { IStreakRepository } from "../../../../domain/interfaces/repository/user/streak-repository.interface";
import { StreakEntity } from "../../../../domain/entities/streak.entity";
import { IStatsRepository } from "../../../../domain/interfaces/repository/user/stats-repository.interface";
import { StatsEntity } from "../../../../domain/entities/stats.entity";
export class DailyChallengeFinishedUseCase implements IDailyChallengeFinishedUseCase {
  constructor(
    private readonly _dailyChallengeRepository: IDailyAssignChallengeRepository,
    private readonly _challengeRepository: IChallengeRepository,
    private readonly _goalRepository: IGoalRepository,
    private readonly _rewardRepository: IRewardRepository,
    private readonly _dailyChallengeProgressRepository: IDailyChallengeProgressRepository,
    private readonly _streakRepository: IStreakRepository,
    private readonly _statsRepository: IStatsRepository,
  ) {}
  async execute(userId: string, wpm: number, accuracy: number): Promise<void> {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    const dailyChallenge =
      await this._dailyChallengeRepository.getTodayChallenge(
        startOfDay,
        endOfDay,
      );
    if (!dailyChallenge) {
      throw new Error(MESSAGES.DAILY_CHALLENGE_NOT_FOUND);
    }
    const challenge = await this._challengeRepository.findById(
      dailyChallenge.getChallengeId(),
    );
    if (!challenge) {
      throw new Error(MESSAGES.CHALLENGE_NOT_FOUND);
    }
    const goal = await this._goalRepository.findById(challenge.getGoal());
    if (!goal) {
      throw new Error(MESSAGES.GOAL_NOT_FOUND);
    }
    const reward = await this._rewardRepository.findById(challenge.getReward());
    if (!reward) {
      throw new Error(MESSAGES.REWARD_NOT_FOUND);
    }
    const isComplete = goal.getWpm() <= wpm && goal.getAccuracy() <= accuracy;
    let dailyChallengeProgress =
      await this._dailyChallengeProgressRepository.findOne({
        userId,
        dailyChallengeId: dailyChallenge.getId(),
        date: { $gte: startOfDay, $lte: endOfDay },
      });
    const wasAlreadyCompleted =
      dailyChallengeProgress?.getStatus() === "completed";

    if (wasAlreadyCompleted) return;
    if (!dailyChallengeProgress) {
      dailyChallengeProgress = new DailyChallengeProgressEntity({
        userId,
        dailyChallengeId: dailyChallenge.getId()!,
        date: today,
        status: isComplete ? "completed" : "in_progress",
        wpm,
        accuracy,
        xpEarned: isComplete ? reward.getXp() : 0,
        startedAt: today,
        completedAt: today,
      });
      await this._dailyChallengeProgressRepository.create(
        dailyChallengeProgress,
      );
    } else {
      dailyChallengeProgress.setStatus(
        isComplete ? "completed" : "in_progress",
      );
      dailyChallengeProgress.setWpm(wpm);
      dailyChallengeProgress.setAccuracy(accuracy);
      dailyChallengeProgress.setXpEarned(isComplete ? reward.getXp() : 0);
      dailyChallengeProgress.setStatus(
        isComplete ? "completed" : "in_progress",
      );
      dailyChallengeProgress.setCompletedAt(today);
      await this._dailyChallengeProgressRepository.update(
        dailyChallengeProgress,
      );
    }
    if (isComplete) {
      const streak = await this._streakRepository.findOne({ userId });
      if (!streak) {
        const streak = new StreakEntity({
          userId,
          currentStreak: 1,
          longestStreak: 1,
          lastCompletedDate: today,
        });
        await this._streakRepository.create(streak);
      } else {
        const fromDay = new Date(streak.getLastCompletedDate()!);
        fromDay.setHours(0, 0, 0, 0);
        const toDay = new Date(today);
        toDay.setHours(0, 0, 0, 0);
        const diffDays = Math.round(
          (toDay.getTime() - fromDay.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (diffDays === 0) return;

        const newStreak = diffDays === 1 ? streak.getCurrentStreak() + 1 : 1;

        streak.setCurrentStreak(newStreak);
        streak.setLongestStreak(Math.max(streak.getLongestStreak(), newStreak));
        streak.setLastCompletedDate(today);
        await this._streakRepository.update(streak);
      }
      const stats = await this._statsRepository.findOne({ userId });
      if (!stats) {
        const stats = new StatsEntity({
          userId,
          totalXp: reward.getXp(),
          level: 1,
        });
        await this._statsRepository.create(stats.toObject());
      } else {
        stats.addXp(reward.getXp());
        await this._statsRepository.update(stats.toObject());
      }
    }
  }
}
