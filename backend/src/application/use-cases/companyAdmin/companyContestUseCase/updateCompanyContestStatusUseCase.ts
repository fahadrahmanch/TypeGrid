import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { IUpdateCompanyContestStatusUseCase } from "../../interfaces/companyAdmin/IUpdateCompanyContestStatusUseCase";
import { ContestEntity } from "../../../../domain/entities/companyContestEntity";
export class updateCompanyContestStatusUseCase implements IUpdateCompanyContestStatusUseCase {
    constructor(
        private _baseRepoContest: IBaseRepository<any>,
    ) { }

    async execute(contestId: string, status: string): Promise<void> {
        const contest = await this._baseRepoContest.findById(contestId);
        if (!contest) {
            throw new Error("Contest not found");
        }
        const contestEntity=new ContestEntity(contest);
        contestEntity.updateStatus(status);
        const updatedStatus=contestEntity.getStatus();
      
        await this._baseRepoContest.update({_id:contestId,status:updatedStatus,...(updatedStatus === "ongoing" && { startTime: new Date() })});
    }
}