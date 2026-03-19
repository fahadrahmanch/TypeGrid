import { IFinishContestUseCase } from "../../interfaces/companyUser/finish-contest.interface";
import { IContestRepository } from "../../../../domain/interfaces/repository/company/contest-repository.interface";
import { IResultRepository } from "../../../../domain/interfaces/repository/result-repository.interface";
import { ResultEntity } from "../../../../domain/entities/result.entity";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { MESSAGES } from "../../../../domain/constants/messages";

/**
 * Use case for finishing a contest and storing results.
 */
export class FinishContestUseCase implements IFinishContestUseCase {
  constructor(
    private readonly _contestRepository: IContestRepository,
    private readonly _resultRepository: IResultRepository,
  ) {}

  /**
   * Complete a contest and save participant results.
   */
  async execute(contestId: string, result: any[]): Promise<void> {
    const contest = await this._contestRepository.findById(contestId);
    if (!contest) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.CONTEST_NOT_FOUND);
    }

    contest.completeContest();

    const rewards = contest.getRewards();

    const finalResult = result.map((item) => {
      const reward = rewards.find((r) => r.rank === item.rank);
      return {
        ...item,
        prize: reward ? reward.prize : 0,
      };
    });

    for (const res of finalResult) {
      const resultEntity = new ResultEntity({
        userId: res.userId,
        contestId,
        type: "contest",
        result: {
          wpm: res.wpm,
          accuracy: Number(res.accuracy),
          errors: res.errors,
          time: res.timeTaken,
          rank: res.rank,
          prize: res.prize,
        },
      });
      await this._resultRepository.create(resultEntity.toObject());
    }

    await this._contestRepository.update(contest.toObject());
  }
}