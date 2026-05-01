import { IGetCompanyDashboardStatsUseCase } from "../interfaces/companyAdmin/get-dashboard-stats.interface";
import { ICompanyDashboardStatsDTO } from "../../DTOs/companyAdmin/dashboard.dto";
import { IUserRepository } from "../../../domain/interfaces/repository/user/user-repository.interface";
import { ICompanyGroupRepository } from "../../../domain/interfaces/repository/company/company-group-repository.interface";
import { IContestRepository } from "../../../domain/interfaces/repository/company/contest-repository.interface";
import { ILessonAssignmentRepository } from "../../../domain/interfaces/repository/company/lesson-assignment-repository.interface";
import { ICompanyUserStatsRepository } from "../../../domain/interfaces/repository/company/company-user-stats-repository.interface";
import { ILessonResultRepository } from "../../../domain/interfaces/repository/company/lesson-result-repository.interface";
import { calculateTrend } from "../../../domain/utils/trend.util";

export class GetCompanyDashboardStatsUseCase implements IGetCompanyDashboardStatsUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _groupRepository: ICompanyGroupRepository,
    private _contestRepository: IContestRepository,
    private _lessonAssignmentRepository: ILessonAssignmentRepository,
    private _companyUserStatsRepository: ICompanyUserStatsRepository,
    private _lessonResultRepository: ILessonResultRepository
  ) {}

  async execute(companyId: string): Promise<ICompanyDashboardStatsDTO> {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalMembers,
      membersBeforeThisMonth,
      totalGroups,
      groupsBeforeThisMonth,
      totalContests,
      contestsBeforeThisMonth,
      totalLessonsAssigned,
      lessonsAssignedBeforeThisMonth,
      avgStats,
      userActivityChartRaw,
      topPerformers,
      pastAvgStats,
    ] = await Promise.all([
      // Member counts
      this._userRepository.countDocuments({ CompanyId: companyId }),
      this._userRepository.countDocuments({ CompanyId: companyId, createdAt: { $lt: startOfCurrentMonth } }),
      
      // Group counts
      this._groupRepository.countDocuments({ companyId }),
      this._groupRepository.countDocuments({ companyId, createdAt: { $lt: startOfCurrentMonth } }),

      // Contest counts
      this._contestRepository.countDocuments({ CompanyId: companyId }),
      this._contestRepository.countDocuments({ CompanyId: companyId, createdAt: { $lt: startOfCurrentMonth } }),

      // Lesson Assignment counts
      this._lessonAssignmentRepository.countDocuments({ companyId }),
      this._lessonAssignmentRepository.countDocuments({ companyId, createdAt: { $lt: startOfCurrentMonth } }),

      // Averages
      this._companyUserStatsRepository.aggregate([
        { $match: { companyId: companyId } },
        { 
          $group: { 
            _id: null, 
            avgWpm: { $avg: "$wpm" }, 
            avgAccuracy: { $avg: "$accuracy" } 
          } 
        }
      ]),

      // User Activity Chart (last 6 months)
      this._lessonResultRepository.aggregate([
        { 
          $match: { 
            companyId: companyId,
            createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) } 
          } 
        },
        { 
          $group: { 
            _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
            count: { $sum: 1 }
          }
        }
      ]),

      // Top Performers
      this._companyUserStatsRepository.aggregate([
        { $match: { companyId: companyId } },
        { $sort: { totalScore: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
          }
        },
        { $unwind: "$user" },
        {
          $project: {
            _id: "$userId",
            name: "$user.name",
            wpm: { $round: ["$wpm", 0] },
            accuracy: { $round: ["$accuracy", 0] },
            score: "$totalScore",
            imageUrl: "$user.imageUrl"
          }
        }
      ]),

      // Past Averages for trend
      this._lessonResultRepository.aggregate([
        { $match: { companyId: companyId, createdAt: { $lt: startOfCurrentMonth } } },
        { 
          $group: { 
            _id: null, 
            avgWpm: { $avg: "$wpm" }, 
            avgAccuracy: { $avg: "$accuracy" } 
          } 
        }
      ])
    ]);

    // Format averages
    const currentWpm = avgStats.length > 0 ? Math.round(avgStats[0].avgWpm) : 0;
    const currentAccuracy = avgStats.length > 0 ? Math.round(avgStats[0].avgAccuracy) : 0;
    const pastWpm = pastAvgStats.length > 0 ? Math.round(pastAvgStats[0].avgWpm) : 0;
    const pastAccuracy = pastAvgStats.length > 0 ? Math.round(pastAvgStats[0].avgAccuracy) : 0;

    // Charts
    const last6Months = Array.from({length: 6}, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
        return { month: d.getMonth() + 1, year: d.getFullYear(), label: d.toLocaleString("default", { month: "short" }) };
    });

    const userActivityChart = last6Months.map(m => {
        const found = userActivityChartRaw.find(r => r._id.month === m.month && r._id.year === m.year);
        return { label: m.label, value: found ? found.count : 0 };
    });

    return {
      totalMembers: {
        value: totalMembers,
        ...calculateTrend(totalMembers, membersBeforeThisMonth)
      },
      totalGroups: {
        value: totalGroups,
        ...calculateTrend(totalGroups, groupsBeforeThisMonth)
      },
      totalContests: {
        value: totalContests,
        ...calculateTrend(totalContests, contestsBeforeThisMonth)
      },
      totalLessonsAssigned: {
        value: totalLessonsAssigned,
        ...calculateTrend(totalLessonsAssigned, lessonsAssignedBeforeThisMonth)
      },
      averageMembersWPM: {
        value: currentWpm,
        ...calculateTrend(currentWpm, pastWpm)
      },
      averageMembersAccuracy: {
        value: `${currentAccuracy}%`,
        ...calculateTrend(currentAccuracy, pastAccuracy)
      },
      userActivityChart,
      topPerformers
    };
  }
}
