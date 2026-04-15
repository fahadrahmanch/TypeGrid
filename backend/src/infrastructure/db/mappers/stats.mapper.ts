import { IStatsDocument } from "../types/documents";
import { StatsEntity } from "../../../domain/entities/stats.entity";

export class StatsMapper {
  static toDomain(doc: IStatsDocument): StatsEntity {
    return new StatsEntity({
      _id: doc._id?.toString(),
      userId: doc.userId.toString(),
      totalXp: doc.totalXp,
      weeklyScore: doc.weeklyScore,
      monthlyScore: doc.monthlyScore,
      totalScore: doc.totalScore,
      totalCompetitions: doc.totalCompetitions,
      wpm: doc.wpm,
      accuracy: doc.accuracy,
      level: doc.level,
    });
  }
}
