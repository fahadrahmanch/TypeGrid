import { Model } from "mongoose";
import { IBaseRepository } from "../../../domain/interfaces/repository/IBaseRepository";

export class BaseRepository<T> implements IBaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }
  async find(filter: any = {}): Promise<T[]> {
    return this.model.find(filter).lean<T[]>().exec();
  }
  async findOne(filter: any = {}): Promise<T | null> {
    return this.model.findOne(filter).lean<T>().exec();
  }
  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }
  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
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
