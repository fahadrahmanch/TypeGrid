import { IStartChallengeUseCase } from "../../application/use-cases/interfaces/companyUser/IStartChallengeUseCase";
export class challengeSocketController {
  constructor(private _startChallengeUseCase: IStartChallengeUseCase) {}
  async execute(challengeId: string): Promise<void> {
    if (!challengeId) {
      return;
    }
    await this._startChallengeUseCase.execute(challengeId);
  }
}
