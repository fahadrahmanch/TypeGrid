import { IFinishContestUseCase } from "../interfaces/companyUser/IFinishContestUseCase";
import { IContestRepository } from "../../../domain/interfaces/repository/company/IContestRepository";
import { IResultRepository } from "../../../domain/interfaces/repository/company/IResultRepository";
import { ContestEntity } from "../../../domain/entities/companyContestEntity";
import { ResultEntity } from "../../../domain/entities/ResultEntity";
export class finishContestUseCase implements IFinishContestUseCase {
  constructor(
    private contestRepository: IContestRepository,
    private resultRepository: IResultRepository,
  ) {}
  async execute(contestId: string, result: any[]): Promise<void> {
    const contest = await this.contestRepository.findById(contestId);
    const contestEntity = contest;
    (contestEntity as any).completeContest();
    const rewards = (contestEntity as any).getRewards();
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
      await this.resultRepository.create(resultObject);
    }
    const contestObject = (contestEntity as any).toObject();
    await this.contestRepository.updateById(contestId, contestObject);
  }
}
