export interface IBaseRepository<T> {
    create(data: T): Promise<T>;
     findById(
    id: string,
    options?: {
      populate?: Parameters<any["populate"]>[0];
    }
  ): Promise<T | null>;

    update(data: any): Promise<any>;
  find(
    filter?: any,
    options?: {
      populate?: { path: string; select?: string };
    }
  ): Promise<T[]>;    FindByEmail(email:string):Promise<T|null>;
    findOne(filter?:any):Promise<T|null>;
    delete(_id:string):Promise<T|null>;
}
