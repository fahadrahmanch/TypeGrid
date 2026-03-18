import { IFinishContestUseCase } from "../../interfaces/companyUser/finish-contest.interface";
import { IContestRepository } from "../../../../domain/interfaces/repository/company/contest-repository.interface";
import { IResultRepository } from "../../../../domain/interfaces/repository/result-repository.interface";
import { ContestEntity } from "../../../../domain/entities/company-contest.entity";
import { ResultEntity } from "../../../../domain/entities/result.entity";
/**
 * Use case for finishing a contest and storing results.
 */
export class FinishContestUseCase implements IFinishContestUseCase {
  constructor(
    private readonly _contestRepository: IContestRepository,
    private readonly _resultRepository: IResultRepository,
  ) { }
  /**
  * Complete a contest and save participant results.
  */
  async execute(contestId: string, result: any[]): Promise<void> {
    const contest = await this._contestRepository.findById(contestId);
    const contestEntity = new ContestEntity(contest);
    contestEntity.completeContest();
    const rewards = contestEntity.getRewards();
    const finalResult = result.map((item) => {
      const reward = rewards.find((r: any) => r.rank === item.rank);

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
      const resultObject = resultEntity.toObject();
      await this._resultRepository.create(resultObject);
    }
    const contestObject = (contestEntity as any).toObject();
    await this._contestRepository.updateById(contestId, contestObject);
  }
}
