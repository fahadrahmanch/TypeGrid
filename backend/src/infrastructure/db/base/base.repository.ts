import { Model, Document } from "mongoose";
import { IBaseRepository } from "../../../domain/interfaces/repository/base-repository.interface";

export class BaseRepository<TDocument, TDomain> implements IBaseRepository<TDomain> {
  protected model: Model<TDocument>;
  protected toDomain: (doc: any) => TDomain;

  constructor(model: Model<TDocument>, toDomain: (doc: any) => TDomain) {
    this.model = model;
    this.toDomain = toDomain;
  }

  async find(
    filter: any = {},
    options?: {
      populate?: { path: string; select?: string };
    },
  ): Promise<TDomain[]> {
    let query = this.model.find(filter);
    if (options?.populate) {
      query = query.populate(options.populate.path, options.populate.select);
    }

    const docs = await query.lean<TDocument[]>().exec();
    return docs.map(doc => this.toDomain(doc));
  }

  async findOne(filter: any = {}): Promise<TDomain | null> {
    const doc = await this.model.findOne(filter).lean<TDocument>().exec();
    return doc ? this.toDomain(doc) : null;
  }

  async create(data: any): Promise<TDomain> {
    const res = await this.model.create(data);
    return this.toDomain(res.toObject());
  }

  async findById(
    id: string,
    options?: {
      populate?: { path: string; select?: string };
    },
  ): Promise<TDomain | null> {
    let query = this.model.findById(id);

    if (options?.populate) {
      query = query.populate(options.populate.path, options.populate.select);
    }

    const doc = await query.lean<TDocument>().exec();
    return doc ? this.toDomain(doc) : null;
  }



  async update(data: any): Promise<any> {
    const { _id, ...updateFields } = data;
    const doc = await this.model
      .findByIdAndUpdate(_id, { $set: updateFields }, { new: true })
      .lean<TDocument>()
      .exec();
    return doc ? this.toDomain(doc) : null;
  }

  async updateById(_id: string, updateQuery: any): Promise<TDomain | null> {
    const doc = await this.model.findByIdAndUpdate(
      _id,
      { $set: updateQuery },
      { new: true },
    ).lean<TDocument>().exec();
    return doc ? this.toDomain(doc) : null;
  }

  async delete(_id: string): Promise<TDomain | null> {
    const doc = await this.model.findByIdAndDelete(_id).exec();
    return doc ? this.toDomain(doc) : null;
  }
}
