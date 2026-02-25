import { ICompanyGroupRepository } from "../../../../domain/interfaces/repository/companyUser/ICompanyGroupRepository";
import { Model } from "mongoose";
import mongoose from "mongoose";

export class companyGroupRepositroy<T> implements ICompanyGroupRepository<T>{
    protected model: Model<T>;
    constructor(model:Model<T>){
        this.model=model;
    }
  async getGroup(userId: string): Promise<T[]> {
   return this.model.find({
      members: new mongoose.Types.ObjectId(userId)
   },{_id:1});
}
}