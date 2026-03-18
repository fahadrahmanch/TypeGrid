import { IContestRepository } from "../../../../domain/interfaces/repository/companyUser/contest-repository.interface";
import { Model } from "mongoose";
import mongoose from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { IContestDocument } from "../../types/documents";
export class ContestRepository extends BaseRepository<IContestDocument> implements IContestRepository {
  constructor(model: Model<IContestDocument>) {
    super(model)
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
