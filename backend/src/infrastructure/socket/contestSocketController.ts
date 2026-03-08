import { IFinishContestUseCase } from "../../application/use-cases/interfaces/companyUser/IFinishContestUseCase";

export class contestSocketController {
  constructor(private _finishContestUseCase: IFinishContestUseCase) {}
  async saveContestResult(contestId: string, result: any[]): Promise<void> {
    if (!contestId || !result) {
      return;
    }
    await this._finishContestUseCase.execute(contestId, result);
  }
}
