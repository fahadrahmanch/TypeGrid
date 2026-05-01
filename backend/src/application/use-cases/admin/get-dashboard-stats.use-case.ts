import { IUserRepository } from "../../../domain/interfaces/repository/user/user-repository.interface";
import { IUserSubscriptionRepository } from "../../../domain/interfaces/repository/user/user-subscription.repository.interface";
import { ICompetitionRepository } from "../../../domain/interfaces/repository/user/competition-repository.interface";
import { IPaymentRepository } from "../../../domain/interfaces/repository/user/payment.repository.interface";
import { ICompanyRepository } from "../../../domain/interfaces/repository/company/company-repository.interface";
import { IResultRepository } from "../../../domain/interfaces/repository/result-repository.interface";
import { IGetDashboardStatsUseCase } from "../../../domain/interfaces/use-case/admin/get-dashboard-stats.interface";
import { IDashboardStatsDTO } from "../../DTOs/admin/dashboard.dto";
import { calculateTrend } from "../../../domain/utils/trend.util";

export class GetDashboardStatsUseCase implements IGetDashboardStatsUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _subscriptionRepository: IUserSubscriptionRepository,
    private _competitionRepository: ICompetitionRepository,
    private _paymentRepository: IPaymentRepository,
    private _companyRepository: ICompanyRepository,
    private _resultRepository: IResultRepository
  ) {}

  async execute(): Promise<IDashboardStatsDTO> {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      usersBeforeThisMonth,
      premiumSubscribers,
      premiumSubBeforeThisMonth,
      totalCompetitions,
      competitionsBeforeThisMonth,
      totalPayments,
      paymentsLastMonth,
      totalCompanies,
      activeCompanies,
      expiredCompanies,
      inactiveCompanies,
      newestCompany,
      activeUsersCount,
      activeUsersLastMonth,
      accuracyStats
    ] = await Promise.all([
      this._userRepository.countDocuments(),
      this._userRepository.countDocuments({ createdAt: { $lt: startOfCurrentMonth } }),
      this._subscriptionRepository.countDocuments({ status: "active" }),
      this._subscriptionRepository.countDocuments({ status: "active", createdAt: { $lt: startOfCurrentMonth } }),
      this._competitionRepository.countDocuments(),
      this._competitionRepository.countDocuments({ createdAt: { $lt: startOfCurrentMonth } }),
      this._paymentRepository.aggregate([
        { $match: { status: "completed", createdAt: { $gte: startOfCurrentMonth } } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      this._paymentRepository.aggregate([
        { $match: { status: "completed", createdAt: { $gte: startOfLastMonth, $lt: startOfCurrentMonth } } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      this._companyRepository.countDocuments(),
      this._companyRepository.countDocuments({ status: "active" }),
      this._companyRepository.countDocuments({ status: "expired" }),
      this._companyRepository.countDocuments({ status: "inactive" }),
      this._companyRepository.getCompanies("", "", 1, 1),
      this._resultRepository.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: "$userId" } },
        { $count: "count" }
      ]),
      this._resultRepository.aggregate([
        { $match: { createdAt: { $lt: thirtyDaysAgo, $gte: sixtyDaysAgo } } },
        { $group: { _id: "$userId" } },
        { $count: "count" }
      ]),
      this._resultRepository.aggregate([
        {
          $bucket: {
            groupBy: "$result.accuracy",
            boundaries: [0, 70, 80, 90, 101],
            default: "Below 70%",
            output: {
              count: { $sum: 1 }
            }
          }
        }
      ])
    ]);

    const currentRevenue = totalPayments.length > 0 ? totalPayments[0].total / 100 : 0;
    const lastRevenue = paymentsLastMonth.length > 0 ? paymentsLastMonth[0].total / 100 : 0;
    
    const activeCurrentCount = activeUsersCount.length > 0 ? activeUsersCount[0].count : 0;
    const activePrevCount = activeUsersLastMonth.length > 0 ? activeUsersLastMonth[0].count : 0;

    // Charts
    const last7Months = Array.from({length: 7}, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - 6 + i, 1);
        return { month: d.getMonth() + 1, year: d.getFullYear(), label: d.toLocaleString("default", { month: "short" }) };
    });

    const [userActivityChartRaw, revenueChartRaw] = await Promise.all([
        this._resultRepository.aggregate([
            { $match: { createdAt: { $gte: new Date(last7Months[0].year, last7Months[0].month - 1, 1) } } },
            { $group: { 
                _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                count: { $sum: 1 }
            }}
        ]),
        this._paymentRepository.aggregate([
            { $match: { status: "completed", createdAt: { $gte: new Date(last7Months[1].year, last7Months[1].month - 1, 1) } } },
            { $group: { 
                _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                total: { $sum: "$amount" }
            }}
        ])
    ]);

    const userActivityChart = last7Months.map(m => {
        const found = userActivityChartRaw.find(r => r._id.month === m.month && r._id.year === m.year);
        return { label: m.label, value: found ? found.count : 0 };
    });

    const revenueChart = last7Months.slice(1).map(m => {
        const found = revenueChartRaw.find(r => r._id.month === m.month && r._id.year === m.year);
        return { label: m.label, value: found ? found.total / 100 : 0 };
    });

    // Accuracy
    const totalAccuracyResults = accuracyStats.reduce((acc: number, curr: any) => acc + curr.count, 0);
    const accuracyMap = accuracyStats.reduce((acc: any, curr: any) => {
        acc[curr._id] = totalAccuracyResults > 0 ? ((curr.count / totalAccuracyResults) * 100).toFixed(0) + "%" : "0%";
        return acc;
    }, {});

    return {
      totalUsers: {
        value: totalUsers,
        ...calculateTrend(totalUsers, usersBeforeThisMonth)
      },
      activeUsers: {
        value: activeCurrentCount,
        ...calculateTrend(activeCurrentCount, activePrevCount)
      },
      premiumSubscribers: {
        value: premiumSubscribers,
        ...calculateTrend(premiumSubscribers, premiumSubBeforeThisMonth)
      },
      competitions: {
        value: totalCompetitions,
        ...calculateTrend(totalCompetitions, competitionsBeforeThisMonth)
      },
      monthlyRevenue: {
        value: `$${currentRevenue.toLocaleString()}`,
        ...calculateTrend(currentRevenue, lastRevenue)
      },
      userActivityChart,
      revenueChart,
      accuracyDistribution: [
        { label: "90-100% Accuracy", percent: accuracyMap[90] || "0%", color: "bg-[#1A1512]" },
        { label: "80-89% Accuracy", percent: accuracyMap[80] || "0%", color: "bg-[#37A4F2]" },
        { label: "70-79% Accuracy", percent: accuracyMap[70] || "0%", color: "bg-[#FF7676]" },
        { label: "Below 70% Accuracy", percent: accuracyMap[0] || "0%", color: "bg-[#FFBC34]" },
      ],
      companyOverview: {
        total: totalCompanies,
        active: activeCompanies,
        expired: expiredCompanies,
        inactive: inactiveCompanies,
      },
      newestCompany: newestCompany.companies.length > 0 ? {
        name: newestCompany.companies[0].companyName ?? "",
        status: newestCompany.companies[0].status ?? ""
      } : null,

      averageAccuracy: totalAccuracyResults > 0 
        ? (await this._resultRepository.aggregate([
            { $group: { _id: null, avg: { $avg: "$result.accuracy" } } }
          ]))[0]?.avg.toFixed(1) + "%"
        : "0%"
    };
  }
}
