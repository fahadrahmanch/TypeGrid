import { IFinishContestUseCase } from '../../application/use-cases/interfaces/companyUser/finish-contest.interface';

export class ContestSocketController {
  constructor(private _finishContestUseCase: IFinishContestUseCase) {}
  async saveContestResult(contestId: string, result: any[]): Promise<void> {
    if (!contestId || !result) {
      return;
    }
    await this._finishContestUseCase.execute(contestId, result);
  }
}
