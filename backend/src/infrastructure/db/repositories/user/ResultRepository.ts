import { Model } from "mongoose";
import { BaseRepository } from "../../base/BaseRepository";
import { IResultRepository } from "../../../../domain/interfaces/repository/company/IResultRepository";
import { IResultDocument } from "../../types/documents";

export class ResultRepository
  extends BaseRepository<IResultDocument>
  implements IResultRepository
{
  constructor(model: Model<IResultDocument>) {
    super(model);
  }
}
