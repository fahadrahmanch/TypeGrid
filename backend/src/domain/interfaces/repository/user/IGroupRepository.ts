import { IGroupDocument } from "../../../../infrastructure/db/types/documents";

export interface IGroupRepository {
  create(data: any): Promise<any>;
  findById(id: string, options?: { populate?: any }): Promise<any | null>;
  update(data: any): Promise<any | null>;
  find(
    filter?: any,
    options?: { populate?: { path: string; select?: string } },
  ): Promise<any[]>;
  findOne(filter?: any): Promise<any | null>;
  delete(_id: string): Promise<any | null>;
  updateById(_id: string, updateQuery: any): Promise<any | null>;
}
