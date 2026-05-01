import { IContestRepository } from "../../../../domain/interfaces/repository/company/contest-repository.interface";
import { Model } from "mongoose";
import mongoose from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { IContestDocument } from "../../types/documents";
import { ContestEntity } from "../../../../domain/entities/company-contest.entity";
import { ContestMapper } from "../../mappers/contest.mapper";

export class ContestRepository extends BaseRepository<IContestDocument, ContestEntity> implements IContestRepository {
  constructor(model: Model<IContestDocument>) {
    super(model, ContestMapper.toDomain);
  }

  async getGroupContests(groupIds: string[]): Promise<ContestEntity[]> {
    const docs = await this.model
      .find({
        contestMode: "group",
        groupId: { $in: groupIds },
        date: { $gt: new Date() },
        status: "upcoming",
      })
      .lean<IContestDocument[]>()
      .exec();
    return docs.map(ContestMapper.toDomain);
  }

  async isJoined(contestId: string, userId: string): Promise<ContestEntity | null> {
    const doc = await this.model
      .findOne({
        _id: new mongoose.Types.ObjectId(contestId),
        participants: new mongoose.Types.ObjectId(userId),
      })
      .lean<IContestDocument>()
      .exec();
    return doc ? ContestMapper.toDomain(doc) : null;
  }
}
