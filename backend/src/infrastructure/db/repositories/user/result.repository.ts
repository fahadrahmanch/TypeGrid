import { Model } from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { IResultRepository } from "../../../../domain/interfaces/repository/result-repository.interface";
import { IResultDocument } from "../../types/documents";
import { ResultEntity } from "../../../../domain/entities/result.entity";
import { ResultMapper } from "../../mappers/result.mapper";

export class ResultRepository extends BaseRepository<IResultDocument, ResultEntity> implements IResultRepository {
  constructor(model: Model<IResultDocument>) {
    super(model, ResultMapper.toDomain);
  }
}
