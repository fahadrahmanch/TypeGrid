import { Model } from "mongoose";
import { BaseRepository } from "../../base/BaseRepository";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/ILessonRepository";
import { ILessonDocument } from "../../types/documents";

export class LessonRepository
  extends BaseRepository<ILessonDocument>
  implements ILessonRepository
{
  constructor(model: Model<ILessonDocument>) {
    super(model);
  }
}
