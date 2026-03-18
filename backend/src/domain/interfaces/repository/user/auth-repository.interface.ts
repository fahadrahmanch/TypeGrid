import { IBaseRepository } from "../base-repository.interface";
import { IUserDocument } from "../../../../infrastructure/db/types/documents";

export interface IAuthRepository {
  findByEmail(email: string): Promise<any | null>;
  getUsers(search:string,status:string,page:number,limit:number): Promise<{users:any[],total:number}>;
  create(data: any): Promise<any>;
  findById(id: string): Promise<any>;
  update(data: any): Promise<any>;
  delete(id: string): Promise<any>;
  find(filter?: any): Promise<any>;
  findOne(filter?: any): Promise<any>;
}
