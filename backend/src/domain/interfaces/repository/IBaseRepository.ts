export interface IBaseRepository<T> {
    create(data: T): Promise<T>;
    findById(id: string): Promise<T | null>;
    update(data: any): Promise< void>;
    find(filter?:any):Promise<T[]>;
    FindByEmail(email:string):Promise<T|null>;
    findOne(filter?:any):Promise<T|null>;
    delete(_id:string):Promise<T|null>;
}
