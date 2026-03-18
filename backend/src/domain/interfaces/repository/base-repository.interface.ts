export interface IBaseRepository<TEntity> {
  create(data: any): Promise<TEntity>;
  findById(
    id: string,
    options?: {
      populate?: any;
    },
  ): Promise<TEntity | null>;
  update(data: any): Promise<any>;
  find(
    filter?: any,
    options?: {
      populate?: { path: string; select?: string };
    },
  ): Promise<TEntity[]>;
  FindByEmail(email: string): Promise<TEntity | null>;
  findOne(filter?: any): Promise<TEntity | null>;
  delete(_id: string): Promise<TEntity | null>;
  updateById(_id: string, updateQuery: any): Promise<TEntity | null>;
}
