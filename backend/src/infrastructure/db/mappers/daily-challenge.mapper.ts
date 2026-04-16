import { IDailyChallengeDocument } from '../types/documents';
import { DailyAssignChallengeEntity } from '../../../domain/entities/daily-challenge.entity';

export class DailyAssignChallengeMapper {
  static toDomain(doc: IDailyChallengeDocument): DailyAssignChallengeEntity {
    return new DailyAssignChallengeEntity({
      _id: doc._id?.toString() ?? '',
      challengeId: doc.challengeId.toString(),
      date: doc.date,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
