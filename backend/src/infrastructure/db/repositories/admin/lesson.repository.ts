import { Model } from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
import { ILessonDocument } from "../../types/documents";

export class LessonRepository
  extends BaseRepository<ILessonDocument>
  implements ILessonRepository
{
  constructor(model: Model<ILessonDocument>) {
    super(model);
  }
}
