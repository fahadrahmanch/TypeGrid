import { BaseRepository } from "../../base/base.repository";
import { IGoalDocument } from "../../types/documents";
import { GoalEntity } from "../../../../domain/entities/goal.entity";
import { IGoalRepository } from "../../../../domain/interfaces/repository/admin/goal-repository.interface";
import { Model } from "mongoose";
import { GoalMapper } from "../../mappers/goal.mapper";

export class GoalRepository extends BaseRepository<IGoalDocument, GoalEntity> implements IGoalRepository {
  constructor(model: Model<IGoalDocument>) {
    super(model, GoalMapper.toDomain);
  }

  async getGoals(searchText: string, page: number, limit: number): Promise<{ goals: GoalEntity[]; total: number }> {
    const filter = searchText
      ? {
          $or: [
            { title: { $regex: "^"+searchText, $options: "i" } },
            { description: { $regex: "^"+searchText, $options: "i" } },
          ],
        }
      : {};

    const total = await this.model.countDocuments(filter);
    const docs = await this.model
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean<IGoalDocument[]>()
      .exec();

    return {
      goals: docs.map((doc) => this.toDomain(doc)),
      total,
    };
  }
}
