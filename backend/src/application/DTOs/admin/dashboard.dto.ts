export interface IDashboardStatsDTO {
  totalUsers: {
    value: number;
    change: string;
    isPositive: boolean;
  };
  activeUsers: {
    value: number;
    change: string;
    isPositive: boolean;
  };
  premiumSubscribers: {
    value: number;
    change: string;
    isPositive: boolean;
  };
  competitions: {
    value: number;
    change: string;
    isPositive: boolean;
  };
  monthlyRevenue: {
    value: string;
    change: string;
    isPositive: boolean;
  };
  userActivityChart: {
    label: string;
    value: number;
  }[];
  revenueChart: {
    label: string;
    value: number;
  }[];
  accuracyDistribution: {
    label: string;
    percent: string;
    color: string;
  }[];
  companyOverview: {
    total: number;
    active: number;
    expired: number;
    inactive: number;
  };
  newestCompany: {
    name: string;
    status: string;
  } | null;
  averageAccuracy: string;
}
