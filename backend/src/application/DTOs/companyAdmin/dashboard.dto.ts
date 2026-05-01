export interface ICompanyDashboardStatsDTO {
  totalMembers: {
    value: number;
    change: string;
    isPositive: boolean;
  };
  totalGroups: {
    value: number;
    change: string;
    isPositive: boolean;
  };
  totalContests: {
    value: number;
    change: string;
    isPositive: boolean;
  };
  totalLessonsAssigned: {
    value: number;
    change: string;
    isPositive: boolean;
  };
  averageMembersWPM: {
    value: number;
    change: string;
    isPositive: boolean;
  };
  averageMembersAccuracy: {
    value: string;
    change: string;
    isPositive: boolean;
  };
  userActivityChart: {
    label: string;
    value: number;
  }[];
  topPerformers: {
    _id: string;
    name: string;
    wpm: number;
    accuracy: number;
    score: number;
    imageUrl?: string;
  }[];
}
