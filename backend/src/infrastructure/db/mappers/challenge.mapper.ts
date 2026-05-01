import { IAdminChallengeDocument } from "../types/documents";
import { ChallengeEntity } from "../../../domain/entities/challenge.entity";

export class ChallengeMapper {
  static toDomain(doc: IAdminChallengeDocument): ChallengeEntity {
    return new ChallengeEntity({
      _id: doc._id?.toString() ?? "",
      title: doc.title,
      difficulty: doc.difficulty,
      goal: doc.goal.toString(),
      reward: doc.reward.toString(),
      duration: doc.duration,
      description: doc.description,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
