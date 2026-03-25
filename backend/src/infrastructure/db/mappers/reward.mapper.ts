import { IRewardDocument } from "../types/documents";
import { RewardEntity } from "../../../domain/entities/reward.entity";

export class RewardMapper {
  static toDomain(doc: IRewardDocument): RewardEntity {
    return new RewardEntity({
      _id: doc._id?.toString() ?? "",
      xp: doc.xp,
      description: doc.description,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}