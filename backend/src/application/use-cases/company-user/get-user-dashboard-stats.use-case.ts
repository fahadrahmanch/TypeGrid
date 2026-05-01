import { IGetUserDashboardStatsUseCase } from "../interfaces/companyUser/get-user-dashboard-stats.interface";
import { ICompanyUserDashboardStatsDTO } from "../../DTOs/companyUser/dashboard.dto";
import { ICompanyUserStatsRepository } from "../../../domain/interfaces/repository/company/company-user-stats-repository.interface";
import { ILessonAssignmentRepository } from "../../../domain/interfaces/repository/company/lesson-assignment-repository.interface";
import { ILessonResultRepository } from "../../../domain/interfaces/repository/company/lesson-result-repository.interface";
import { calculateTrend } from "../../../domain/utils/trend.util";
import mongoose from "mongoose";

export class GetUserDashboardStatsUseCase implements IGetUserDashboardStatsUseCase {
  constructor(
    private _companyUserStatsRepository: ICompanyUserStatsRepository,
    private _lessonAssignmentRepository: ILessonAssignmentRepository,
    private _lessonResultRepository: ILessonResultRepository
  ) {}

  async execute(userId: string, companyId: string): Promise<ICompanyUserDashboardStatsDTO> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const companyObjectId = new mongoose.Types.ObjectId(companyId);

    // Date calculations for current week (Mon-Sun)
    const now = new Date();
    // 0 = Sunday, 1 = Monday. Let's adjust to make Monday = 0
    const currentDay = now.getDay();
    const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
    
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - distanceToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const [
      userStats,
      totalAssignedLessons,
      completedLessons,
      pastAvgStats,
      weeklyChartDataRaw
    ] = await Promise.all([
      // Overall User Stats
      this._companyUserStatsRepository.findOne({ userId: userObjectId, companyId: companyObjectId }),
      
      // Breakdown of Lessons
      this._lessonAssignmentRepository.countDocuments({ userId: userObjectId, companyId: companyObjectId }),
      this._lessonAssignmentRepository.countDocuments({ 
        userId: userObjectId, 
        companyId: companyObjectId, 
        status: "completed" 
      }),

      // Past Average (Before this week)
      this._lessonResultRepository.aggregate([
        { $match: { userId: userObjectId, companyId: companyObjectId, createdAt: { $lt: startOfWeek } } },
        { 
          $group: { 
            _id: null, 
            avgWpm: { $avg: "$wpm" }, 
            avgAccuracy: { $avg: "$accuracy" } 
          } 
        }
      ]),

      // Weekly Top WPM Progress (Current week)
      this._lessonResultRepository.aggregate([
        { 
          $match: { 
            userId: userObjectId, 
            companyId: companyObjectId, 
            createdAt: { $gte: startOfWeek } 
          } 
        },
        { 
          $group: { 
            // group by day of month so Monday-Sunday
            _id: { day: { $dayOfMonth: "$createdAt" }, dayOfWeek: { $dayOfWeek: "$createdAt" } },
            highestWpm: { $max: "$wpm" }
          }
        }
      ])
    ]);

    const currentWpm = userStats ? Math.round(userStats.getWpm()) : 0;
    const currentAccuracy = userStats ? Math.round(userStats.getAccuracy()) : 0;
    const pastWpm = pastAvgStats.length > 0 ? Math.round(pastAvgStats[0].avgWpm) : 0;
    const pastAccuracy = pastAvgStats.length > 0 ? Math.round(pastAvgStats[0].avgAccuracy) : 0;

    // Formatting week structure
    const daysLabel = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    
    // We map days from start of week to end of week
    const progressChart = daysLabel.map((label, index) => {
      // get Date for that specific day of week
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + index);
      
      // dayOfWeek in MongoDB: 1 (Sun), 2 (Mon) ... 7 (Sat)
      const mongoDayOfWeek = d.getDay() + 1; 

      const dayData = weeklyChartDataRaw.find(r => r._id.dayOfWeek === mongoDayOfWeek);
      return {
        label,
        value: dayData ? dayData.highestWpm : 0
      };
    });

    return {
      currentWpm: {
        value: currentWpm,
        ...calculateTrend(currentWpm, pastWpm)
      },
      accuracy: {
        value: `${currentAccuracy}%`,
        ...calculateTrend(currentAccuracy, pastAccuracy)
      },
      completedLessons: {
        completed: completedLessons,
        total: totalAssignedLessons
      },
      progressChart
    };
  }
}
