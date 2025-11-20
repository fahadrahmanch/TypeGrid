import { Model } from "mongoose";
import { IBaseRepository } from "../../../domain/interfaces/repository/user/IBaseRepository";
export class BaseRepository<T> implements IBaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }
    async update(user: any): Promise<void> {
        await this.model.updateOne(
            { _id: user._id },
            { $set: user }
        );
    }

}
