import { IResultDocument } from "../types/documents";
import { ResultEntity } from "../../../domain/entities/result.entity";

export class ResultMapper {
  static toDomain(doc: IResultDocument): ResultEntity {
    return new ResultEntity({
      _id: doc._id?.toString(),
      userId: doc.userId?.toString(),
      type: doc.type as any,
      competitionId: doc.competitionId?.toString(),
      contestId: doc.contestId?.toString(),
      result: doc.result,
    });
  }
}
