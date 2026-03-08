import { IContestRepository } from "../../../../domain/interfaces/repository/companyUser/contest-repository.interface";
import { Model } from "mongoose";
import mongoose from "mongoose";

export class ContestRepository<T> implements IContestRepository<T> {
  protected model: Model<T>;
  constructor(model: Model<T>) {
    this.model = model;
  }
  async getGroupContests(groupIds: string[]) {
    return await this.model.find({
      contestMode: "group",
      groupId: { $in: groupIds },
      date: { $gt: new Date() },
      status: "upcoming",
    });
  }
  async isJoined(contestId: string, userId: string) {
    return this.model.findOne({
      _id: new mongoose.Types.ObjectId(contestId),
      participants: new mongoose.Types.ObjectId(userId),
    });
  }
}
