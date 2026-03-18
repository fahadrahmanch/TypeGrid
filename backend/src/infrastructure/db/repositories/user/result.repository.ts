import { Model } from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { IResultRepository } from "../../../../domain/interfaces/repository/result-repository.interface";
import { IResultDocument } from "../../types/documents";

export class ResultRepository
  extends BaseRepository<IResultDocument>
  implements IResultRepository {
  constructor(model: Model<IResultDocument>) {
    super(model);
  }
}
