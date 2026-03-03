import { IFinishContestUseCase } from "../interfaces/companyUser/IFinishContestUseCase";
import { IBaseRepository } from "../../../domain/interfaces/repository/IBaseRepository";
import { ContestEntity } from "../../../domain/entities/companyContestEntity";
import { ResultEntity } from "../../../domain/entities/ResultEntity";
export class finishContestUseCase implements IFinishContestUseCase {
  constructor(
    private _baseRepocontest: IBaseRepository<any>,
    private _baseRepoResult: IBaseRepository<any>,
  ) {}
  async execute(contestId: string, result: any[]): Promise<void> {
    console.log("contest id in usecase", contestId);
    console.log("result in use Case", result);
    const contest = await this._baseRepocontest.findById(contestId);
    const contestEntity = new ContestEntity(contest);
    contestEntity.completeContest();
    const contesttoObject=contestEntity.toObject()
    const rewards = contestEntity.getRewards();
    const finalResult = result.map((item) => {
      const reward = rewards.find((r) => r.rank === item.rank);

      return {
        ...item,
        prize: reward ? reward.prize : 0,
      };
    });
       for(const res of finalResult){
                    const resultEntity=new ResultEntity({
                        userId:res.userId,
                        contestId,
                        type:"contest",
                        result:{
                            wpm:res.wpm,
                            accuracy:Number(res.accuracy),
                            errors:res.errors,
                            time:res.timeTaken,
                            rank:res.rank,
                            prize:res.prize
                        }
                    });
                    const resultObject=await resultEntity.toObject();
                    await this._baseRepoResult.create(resultObject); 
                    
                }
                await this._baseRepocontest.update({_id:contestId,...contesttoObject})
}
}
