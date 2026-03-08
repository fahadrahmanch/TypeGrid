import { Model, Types } from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { IContestRepository } from "../../../../domain/interfaces/repository/company/contest-repository.interface";
import { IContestDocument } from "../../types/documents";

export class ContestRepository
  extends BaseRepository<IContestDocument>
  implements IContestRepository
{
  constructor(model: Model<IContestDocument>) {
    super(model);
  }

  async getGroupContests(groupsId: string[]): Promise<IContestDocument[]> {
    return this.model
      .find({
        contestMode: "group",
        groupId: { $in: groupsId },
        date: { $gt: new Date() },
        status: "upcoming",
      })
      .lean<IContestDocument[]>()
      .exec();
  }

  async isJoined(
    contestId: string,
    userId: string,
  ): Promise<IContestDocument | null> {
    return this.model
      .findOne({
        _id: new Types.ObjectId(contestId),
        participants: new Types.ObjectId(userId),
      })
      .lean<IContestDocument>()
      .exec();
  }
}
