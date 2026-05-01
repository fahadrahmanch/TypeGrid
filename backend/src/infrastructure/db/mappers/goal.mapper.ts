import { IGoalDocument } from "../types/documents";
import { GoalEntity } from "../../../domain/entities/goal.entity";

export class GoalMapper {
  static toDomain(doc: IGoalDocument): GoalEntity {
    return new GoalEntity({
      _id: doc._id?.toString() ?? "",
      title: doc.title,
      wpm: doc.wpm,
      accuracy: doc.accuracy,
      description: doc.description,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
