export interface IBaseRepository<T> {
  create(data: any): Promise<T>;
  findById(
    id: string,
    options?: {
      populate?: any;
    },
  ): Promise<T | null>;
  update(data: any): Promise<any>;
  find(
    filter?: any,
    options?: {
      populate?: { path: string; select?: string };
    },
  ): Promise<T[]>;
  FindByEmail(email: string): Promise<T | null>;
  findOne(filter?: any): Promise<T | null>;
  delete(_id: string): Promise<T | null>;
  updateById(_id: string, updateQuery: any): Promise<T | null>;
}
