import { Model } from "mongoose";
import { IBaseRepository } from "../../../domain/interfaces/repository/IBaseRepository";

export class BaseRepository<T> implements IBaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }
 async find(
  filter: any = {},
  options?: {
    populate?: { path: string; select?: string };
  }
): Promise<T[]> {

  let query = this.model.find(filter);

  if (options?.populate) {
    query = query.populate(
      options.populate.path,
      options.populate.select
    );
  }

  return query.lean<T[]>().exec();
}

  async findOne(filter: any = {}): Promise<T | null> {
    return this.model.findOne(filter).lean<T>().exec();
  }
  async create(data: Partial<T>): Promise<T> {
    const res = await this.model.create(data);
    return res.toObject() as T;
  }
async findById(
  id: string,
  options?: {
    populate?: { path: string; select?: string };
  }
): Promise<T | null> {

  let query = this.model.findById(id);

  if (options?.populate) {
    query = query.populate(
      options.populate.path,
      options.populate.select
    );
  }

  return query.lean<T>().exec();
}



  async FindByEmail(email: string): Promise<T | null> {
    const userDoc = await this.model.findOne({ email });
    if (!userDoc) return null;
    const obj = userDoc.toObject();
    return obj;
  }
  async update(data: any): Promise<any> {
        const { _id, ...updateFields } = data;
      
    return await this.model.findByIdAndUpdate(
      _id,
      { $set: updateFields },
      { new: true }
    ).lean<T>().exec();
  }
  async delete(_id:string):Promise<T|null>{
    return this.model.findByIdAndDelete(_id);
  }

}
