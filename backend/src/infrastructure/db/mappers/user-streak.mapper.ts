import { IUserStreakDocument } from "../types/documents";
import { UserStreakEntity } from "../../../domain/entities/user-streak.entity";

export class UserStreakMapper {
  static toDomain(doc: IUserStreakDocument): UserStreakEntity {
    return new UserStreakEntity({
      _id: doc._id?.toString() ?? "",
      userId: doc.userId.toString(),
      currentStreak: doc.currentStreak,
      longestStreak: doc.longestStreak,
      lastCompletedDate: doc.lastCompletedDate,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
