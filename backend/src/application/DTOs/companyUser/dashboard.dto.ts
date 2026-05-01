export interface ICompanyUserDashboardStatsDTO {
  currentWpm: {
    value: number;
    change: string;
    isPositive: boolean;
  };
  accuracy: {
    value: string;
    change: string;
    isPositive: boolean;
  };
  completedLessons: {
    completed: number;
    total: number;
  };
  progressChart: {
    label: string;
    value: number;
  }[];
}
