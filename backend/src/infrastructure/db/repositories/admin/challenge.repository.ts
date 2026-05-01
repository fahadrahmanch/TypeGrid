import { BaseRepository } from "../../base/base.repository";
import { IAdminChallengeDocument } from "../../types/documents";
import { ChallengeEntity } from "../../../../domain/entities/challenge.entity";
import { IChallengeRepository } from "../../../../domain/interfaces/repository/admin/challenge-repository.interface";
import { Model } from "mongoose";
import { ChallengeMapper } from "../../mappers/challenge.mapper";

export class ChallengeRepository
  extends BaseRepository<IAdminChallengeDocument, ChallengeEntity>
  implements IChallengeRepository
{
  constructor(model: Model<IAdminChallengeDocument>) {
    super(model, ChallengeMapper.toDomain);
  }

  async getChallenges(
    searchText: string,
    page: number,
    limit: number
  ): Promise<{ challenges: ChallengeEntity[]; total: number }> {
    const filter = searchText
      ? {
          $or: [
            { title: { $regex: "^" + searchText, $options: "i" } },
            // { description: { $regex: searchText, $options: "i" } },
          ],
        }
      : {};

    const total = await this.model.countDocuments(filter);
    const docs = await this.model
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean<IAdminChallengeDocument[]>()
      .exec();

    return {
      challenges: docs.map((doc) => this.toDomain(doc)),
      total,
    };
  }
}
