import { ICompanyUserStatsDocument } from "../types/documents";
import { CompanyUserStatsEntity } from "../../../domain/entities";

export class CompanyUserStatsMapper {
  static toDomain(doc: ICompanyUserStatsDocument): CompanyUserStatsEntity {
    return new CompanyUserStatsEntity({
      _id: doc._id?.toString(),
      userId: doc.userId.toString(),
      companyId: doc.companyId.toString(),
      totalScore: doc.totalScore,
      weeklyScore: doc.weeklyScore,
      monthlyScore: doc.monthlyScore,
      wpm: doc.wpm,
      accuracy: doc.accuracy,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
