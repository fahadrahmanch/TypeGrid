export interface DailyChallengeStatsDTO {
  calendarData: {
    [key: string]: "completed" | "missed";
  };
  streakTracker: {
    currentStreak: number;
    nextMilestone: number;
  };
  weeklyGoal: {
    completedSessions: number;
    targetSessions: number;
  };
  statistics: {
    longestStreak: number;
    totalCompleted: number;
    monthCompleted: number;
    monthTarget: number;
  };
}
