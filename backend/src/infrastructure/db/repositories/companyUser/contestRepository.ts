import { IContestRepository } from "../../../../domain/interfaces/repository/companyUser/IContestRepository";
import { Model } from "mongoose";
import mongoose from "mongoose";

export class contestRepository<T> implements IContestRepository<T>{
    protected model: Model<T>;
    constructor(
        model:Model<T>
    ){

        this.model=model;
    }
   async getGroupContests(groupIds: string[]) {
    return await this.model.find({
        contestMode: "group",
        groupId: { $in: groupIds }
    });
}
async isJoined(contestId:string,userId:string){
    return this.model.findOne({_id:new mongoose.Types.ObjectId(contestId),participants:new mongoose.Types.ObjectId(userId)});
}
}