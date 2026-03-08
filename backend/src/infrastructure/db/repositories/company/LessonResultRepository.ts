import { Model } from "mongoose";
import { BaseRepository } from "../../base/BaseRepository";
import { ILessonResultRepository } from "../../../../domain/interfaces/repository/company/ILessonResultRepository";
import { ILessonResultDocument } from "../../types/documents";

export class LessonResultRepository
  extends BaseRepository<ILessonResultDocument>
  implements ILessonResultRepository
{
  constructor(model: Model<ILessonResultDocument>) {
    super(model);
  }
}
