export interface IBaseRepository<T> {
    create(data: T): Promise<T>;
    findById(id: string): Promise<T | null>;
    update(data: any): Promise< void>;
    find():Promise<T[]>
    FindByEmail(email:string):Promise<T|null>
}
