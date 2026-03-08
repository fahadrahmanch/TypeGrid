import { Model } from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { ILessonResultRepository } from "../../../../domain/interfaces/repository/company/lesson-result-repository.interface";
import { ILessonResultDocument } from "../../types/documents";

export class LessonResultRepository
  extends BaseRepository<ILessonResultDocument>
  implements ILessonResultRepository
{
  constructor(model: Model<ILessonResultDocument>) {
    super(model);
  }
}
