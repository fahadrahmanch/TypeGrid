import { Model } from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
import { ILessonDocument } from "../../types/documents";
import { LessonEntity } from "../../../../domain/entities/lesson.entity";

export class LessonRepository
  extends BaseRepository<ILessonDocument>
  implements ILessonRepository
{
  constructor(model: Model<ILessonDocument>) {
    super(model);
  }
  async getLessons(status:string,searchText:string,page:number,limit:number): Promise<{lessons:any[],total:number}> {
    const query: any = {};
    if (status) {
      query.status = status;
    }
    if (searchText) {
      query.text = { $regex: "^"+searchText, $options: "i" };
    }
    const lessons = await this.model.find(query).skip((page - 1) * limit).limit(limit);
    const total = await this.model.countDocuments(query);
    return { lessons, total };
  }
}
