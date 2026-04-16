import { IDailyChallengeProgressDocument } from '../types/documents';
import { DailyChallengeProgressEntity } from '../../../domain/entities/daily-challenge-progress.entity';

export class DailyChallengeProgressMapper {
  static toDomain(doc: IDailyChallengeProgressDocument): DailyChallengeProgressEntity {
    return new DailyChallengeProgressEntity({
      _id: doc._id?.toString() ?? '',
      userId: doc.userId.toString(),
      dailyChallengeId: doc.dailyChallengeId.toString(),
      date: doc.date,
      status: doc.status,
      wpm: doc.wpm,
      accuracy: doc.accuracy,
      xpEarned: doc.xpEarned,
      startedAt: doc.startedAt,
      completedAt: doc.completedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
