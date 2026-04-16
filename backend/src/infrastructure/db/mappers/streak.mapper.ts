import { IStreakDocument } from '../types/documents';
import { StreakEntity } from '../../../domain/entities/streak.entity';

export class StreakMapper {
  static toDomain(doc: IStreakDocument): StreakEntity {
    return new StreakEntity({
      _id: doc._id?.toString() ?? '',
      userId: doc.userId.toString(),
      currentStreak: doc.currentStreak,
      longestStreak: doc.longestStreak,
      lastCompletedDate: doc.lastCompletedDate,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
