import { Model } from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { IDailyChallengeDocument } from "../../types/documents";
import { DailyAssignChallengeEntity } from "../../../../domain/entities/daily-challenge.entity";
import { IDailyAssignChallengeRepository } from "../../../../domain/interfaces/repository/admin/daily-challenge-repository.interface";
import { DailyAssignChallengeMapper } from "../../mappers/daily-challenge.mapper";

export class DailyAssignChallengeRepository
  extends BaseRepository<IDailyChallengeDocument, DailyAssignChallengeEntity>
  implements IDailyAssignChallengeRepository
{
  constructor(model: Model<IDailyChallengeDocument>) {
    super(model, DailyAssignChallengeMapper.toDomain);
  }

  async getDailyAssignChallenges(
    date: string,
    page: number,
    limit: number
  ): Promise<{ dailyChallenges: DailyAssignChallengeEntity[]; total: number }> {
    const filter: Record<string, unknown> = {};

    if (date) {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        const startOfDay = new Date(parsedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(parsedDate);
        endOfDay.setHours(23, 59, 59, 999);
        filter.date = { $gte: startOfDay, $lte: endOfDay };
      }
    }

    const total = await this.model.countDocuments(filter);
    const docs = await this.model
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ date: -1 })
      .lean<IDailyChallengeDocument[]>()
      .exec();

    return {
      dailyChallenges: docs.map((doc) => this.toDomain(doc)),
      total,
    };
  }

  async getTodayChallenge(startOfDay: Date, endOfDay: Date): Promise<DailyAssignChallengeEntity | null> {
    const  doc=await this.model.findOne({date:{$gte:startOfDay,$lte:endOfDay}}).lean<IDailyChallengeDocument>().exec();
    return doc?this.toDomain(doc):null;
  }
    

}